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
  }

  /**
   * 初始化游戏
   */
  init() {
    // 获取Canvas（微信小游戏使用系统Canvas）
    const systemInfo = wx.getSystemInfoSync();
    this.canvas = wx.createCanvas();
    
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
        const touch = e.touches[0];
        // 微信小游戏触摸坐标通常是实际屏幕坐标
        // 需要转换到设计分辨率坐标
        const screenX = touch.clientX || touch.x;
        const screenY = touch.clientY || touch.y;
        
        // 转换到设计分辨率坐标
        // 微信小游戏的触摸坐标是相对于实际屏幕的，需要除以缩放比例
        const designX = screenX / this.scale;
        const designY = screenY / this.scale;
        
        console.log('触摸事件:', { 
          screenX, screenY,
          designX, designY,
          designWidth: this.designWidth,
          designHeight: this.designHeight,
          scale: this.scale,
          currentScene: this.currentScene?.constructor?.name 
        });
        
        if (this.currentScene && this.currentScene.handleClick) {
          this.currentScene.handleClick(designX, designY);
        } else {
          console.warn('当前场景没有handleClick方法或场景为空');
        }
      }
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

