/**
 * 游戏主入口文件
 */
const LevelManager = require('./managers/LevelManager');
const StorageManager = require('./managers/StorageManager');
const AudioManager = require('./managers/AudioManager');
const EffectManager = require('./managers/EffectManager');
const MenuScene = require('./scenes/MenuScene');
const GameScene = require('./scenes/GameScene');
const ResultScene = require('./scenes/ResultScene');

class Game {
  constructor() {
    this.canvas = null;
    this.ctx = null;
    this.currentScene = null;
    
    // 设计分辨率
    this.designWidth = 1080;
    this.designHeight = 2340;
    
    // 实际屏幕尺寸和缩放比例
    this.screenWidth = 0;
    this.screenHeight = 0;
    this.scaleX = 1;
    this.scaleY = 1;
    this.scale = 1;
    
    // 安全区域信息
    this.safeArea = null;
    
    // 管理器
    this.levelManager = new LevelManager();
    this.storageManager = new StorageManager();
    this.audioManager = new AudioManager();
    this.effectManager = null;
    
    // 场景
    this.menuScene = null;
    this.gameScene = null;
    this.resultScene = null;
    
    // 游戏循环
    this.lastTime = 0;
    this.animationFrameId = null;
    
    // 触摸手势相关
    this.lastTouchStart = null;
  }

  /**
   * 初始化游戏
   */
  init() {
    // 获取Canvas（微信小游戏使用系统Canvas）
    const systemInfo = wx.getSystemInfoSync();
    this.canvas = wx.createCanvas();
    
    // 获取安全区域信息
    this.safeArea = systemInfo.safeArea || {
      left: 0,
      right: systemInfo.windowWidth,
      top: 0,
      bottom: systemInfo.windowHeight,
      width: systemInfo.windowWidth,
      height: systemInfo.windowHeight
    };
    
    // 设置Canvas为设计分辨率
    this.canvas.width = this.designWidth;
    this.canvas.height = this.designHeight;
    this.ctx = this.canvas.getContext('2d');
    
    // 计算实际屏幕尺寸和缩放比例
    this.screenWidth = systemInfo.windowWidth;
    this.screenHeight = systemInfo.windowHeight;
    this.scaleX = this.screenWidth / this.designWidth;
    this.scaleY = this.screenHeight / this.designHeight;
    this.scale = Math.min(this.scaleX, this.scaleY); // 使用较小的缩放比例保持宽高比

    // 初始化特效管理器
    this.effectManager = new EffectManager(this.canvas);

    // 初始化存储管理器
    this.storageManager.init();

    // 初始化音频管理器
    this.audioManager.init(this.storageManager);

    // 创建场景
    this.menuScene = new MenuScene(this);
    this.gameScene = new GameScene(this);
    this.resultScene = new ResultScene(this);

    // 绑定事件
    this.bindEvents();

    // 显示菜单
    this.showMenu();
  }

  /**
   * 绑定事件
   */
  bindEvents() {
    // 触摸开始（微信小游戏触摸事件）
    wx.onTouchStart((e) => {
      if (e.touches && e.touches.length > 0) {
        // 转换所有触摸点到设计分辨率坐标
        const designTouches = e.touches.map(t => ({
          identifier: t.identifier || t.id || 0,
          id: t.identifier || t.id || 0,
          x: (t.clientX || t.x) / this.scale,
          y: (t.clientY || t.y) / this.scale
        }));

        // 如果是GameScene，使用手势处理
        if (this.currentScene && this.currentScene.constructor.name === 'GameScene') {
          if (this.currentScene.handleTouchStart) {
            this.currentScene.handleTouchStart(designTouches);
          }
          
          // 如果是单点触摸且没有拖动，作为点击处理
          if (designTouches.length === 1 && !this.currentScene.isPanning) {
            // 延迟处理点击，等待移动事件判断是否是拖动
            this.lastTouchStart = {
              x: designTouches[0].x,
              y: designTouches[0].y,
              time: Date.now()
            };
          }
          return;
        }
        
        // 其他场景，直接作为点击处理
        const touch = designTouches[0];
        if (this.currentScene && this.currentScene.handleClick) {
          this.currentScene.handleClick(touch.x, touch.y);
        } else {
          console.warn('当前场景没有handleClick方法或场景为空');
        }
      }
    });

    // 触摸移动
    wx.onTouchMove((e) => {
      if (e.touches && e.touches.length > 0) {
        // 转换所有触摸点到设计分辨率坐标
        const designTouches = e.touches.map(t => ({
          identifier: t.identifier || t.id || 0,
          id: t.identifier || t.id || 0,
          x: (t.clientX || t.x) / this.scale,
          y: (t.clientY || t.y) / this.scale
        }));

        // 如果是GameScene，使用手势处理
        if (this.currentScene && this.currentScene.constructor.name === 'GameScene') {
          if (this.currentScene.handleTouchMove) {
            this.currentScene.handleTouchMove(designTouches);
          }
        }
      }
    });

    // 触摸结束
    wx.onTouchEnd((e) => {
      // 转换剩余触摸点到设计分辨率坐标
      const designTouches = (e.touches || []).map(t => ({
        identifier: t.identifier || t.id || 0,
        id: t.identifier || t.id || 0,
        x: (t.clientX || t.x) / this.scale,
        y: (t.clientY || t.y) / this.scale
      }));

      if (this.currentScene && this.currentScene.constructor.name === 'GameScene') {
        if (this.currentScene.handleTouchEnd) {
          this.currentScene.handleTouchEnd(designTouches);
        }
        
        // 如果触摸结束且没有拖动，且是单点触摸，触发点击事件
        if (designTouches.length === 0 && this.lastTouchStart && !this.currentScene.isPanning) {
          const changedTouch = e.changedTouches[0];
          if (changedTouch) {
            const designX = (changedTouch.clientX || changedTouch.x) / this.scale;
            const designY = (changedTouch.clientY || changedTouch.y) / this.scale;
            // 检查移动距离，如果很小则认为是点击
            const moveDistance = Math.sqrt(
              Math.pow(designX - this.lastTouchStart.x, 2) + 
              Math.pow(designY - this.lastTouchStart.y, 2)
            );
            if (moveDistance < 10) { // 10像素阈值
              this.currentScene.handleClick(designX, designY);
            }
          }
        }
        this.lastTouchStart = null;
      }
    });

    // 触摸取消
    wx.onTouchCancel((e) => {
      if (this.currentScene && this.currentScene.constructor.name === 'GameScene') {
        // 触摸取消时重置状态
        if (this.currentScene.handleTouchEnd) {
          this.currentScene.handleTouchEnd([]);
        }
      }
      this.lastTouchStart = null;
    });

    // 窗口大小改变
    wx.onWindowResize(() => {
      const systemInfo = wx.getSystemInfoSync();
      // 更新实际屏幕尺寸和缩放比例
      this.screenWidth = systemInfo.windowWidth;
      this.screenHeight = systemInfo.windowHeight;
      this.scaleX = this.screenWidth / this.designWidth;
      this.scaleY = this.screenHeight / this.designHeight;
      this.scale = Math.min(this.scaleX, this.scaleY);
      
      // Canvas保持设计分辨率，通过缩放适配
      if (this.currentScene && this.currentScene.calculateRenderParams) {
        this.currentScene.calculateRenderParams();
      }
    });
  }

  /**
   * 显示菜单场景
   */
  async showMenu() {
    this.currentScene = this.menuScene;
    await this.menuScene.init();
    this.startGameLoop();
  }

  /**
   * 开始关卡
   * @param {number} levelId - 关卡ID
   */
  async startLevel(levelId) {
    try {
      this.storageManager.setCurrentLevel(levelId);
      this.currentScene = this.gameScene;
      await this.gameScene.init(levelId);
      this.startGameLoop();
    } catch (error) {
      console.error('加载关卡失败:', error);
      // 显示错误提示，返回菜单
      wx.showToast({
        title: '加载关卡失败',
        icon: 'none',
        duration: 2000
      });
      // 延迟返回菜单
      setTimeout(() => {
        this.showMenu();
      }, 2000);
    }
  }

  /**
   * 显示结果场景
   * @param {boolean} isVictory - 是否胜利
   */
  showResult(isVictory) {
    const levelId = this.gameScene.currentLevelId;
    this.currentScene = this.resultScene;
    this.resultScene.init(isVictory, levelId);
    this.startGameLoop();
  }

  /**
   * 开始游戏循环
   */
  startGameLoop() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
    this.lastTime = Date.now();
    this.gameLoop();
  }

  /**
   * 游戏循环
   */
  gameLoop() {
    const currentTime = Date.now();
    const deltaTime = currentTime - this.lastTime;
    this.lastTime = currentTime;

    // 更新场景
    if (this.currentScene && this.currentScene.update) {
      this.currentScene.update(deltaTime);
    }

    // 渲染场景
    if (this.currentScene && this.currentScene.render) {
      this.currentScene.render();
    }

    // 继续循环（使用标准的requestAnimationFrame或setTimeout）
    if (typeof requestAnimationFrame !== 'undefined') {
      this.animationFrameId = requestAnimationFrame(() => this.gameLoop());
    } else {
      // 降级方案：使用setTimeout
      this.animationFrameId = setTimeout(() => this.gameLoop(), 16); // 约60fps
    }
  }

  /**
   * 停止游戏循环
   */
  stopGameLoop() {
    if (this.animationFrameId) {
      if (typeof cancelAnimationFrame !== 'undefined') {
        cancelAnimationFrame(this.animationFrameId);
      } else {
        clearTimeout(this.animationFrameId);
      }
      this.animationFrameId = null;
    }
  }

  /**
   * 销毁游戏
   */
  destroy() {
    this.stopGameLoop();
    this.audioManager.destroy();
    this.effectManager.clear();
  }
}

// 启动游戏
const game = new Game();
game.init();

// 导出供其他模块使用
module.exports = Game;

