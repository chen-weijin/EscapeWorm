/**
 * 游戏主场景
 */
const Worm = require('../entities/Worm');
const PathFinder = require('../utils/PathFinder');
const CollisionDetector = require('../utils/CollisionDetector');

class GameScene {
  constructor(game) {
    this.game = game;
    this.levelManager = game.levelManager;
    this.audioManager = game.audioManager;
    this.effectManager = game.effectManager;
    this.canvas = game.canvas;
    this.ctx = game.ctx;
    
    this.worms = [];
    this.matrix = null;
    this.escapePoints = [];
    this.failCount = 3; // 失败次数
    this.isGameOver = false;
    this.isVictory = false;
    this.currentLevelId = null;
    this.isWormsAppearing = false; // 蠕虫是否正在显示中
    
    // 渲染相关
    this.cellSize = 30;
    this.offsetX = 0;
    this.offsetY = 0;
    this.zoom = 1.0;
    
    // 游戏核心区域相关（父节点）
    this.gameCoreScale = 1.0; // 游戏核心区域的缩放比例
    this.baseCellSize = 0; // 基准格子大小（15*19时的cellSize）
    this.gameCoreOffsetX = 0; // 游戏核心区域的X偏移
    this.gameCoreOffsetY = 0; // 游戏核心区域的Y偏移
    
    // 触摸手势相关
    this.touches = []; // 当前触摸点数组（设计分辨率坐标）
    this.isPanning = false; // 是否正在拖动地图
    this.panStartX = 0; // 拖动开始时的X坐标
    this.panStartY = 0; // 拖动开始时的Y坐标
    this.panOffsetX = 0; // 地图拖动偏移X（累加值）
    this.panOffsetY = 0; // 地图拖动偏移Y（累加值）
    this.initialZoom = 1.0; // 缩放开始时的zoom值
    this.initialDistance = 0; // 双指初始距离
    this.minZoom = 0.5; // 最小缩放
    this.maxZoom = 3.0; // 最大缩放
    
    // 滑块拖动状态
    this.isDraggingSlider = false; // 是否正在拖动滑块
    
    // 蠕虫图片资源
    this.wormHeadImage = null;
    this.wormBodyImage = null;
    this.wormTailImage = null;
    this.imagesLoaded = false;
    
    // 移动动画（支持多条蠕虫同时移动，不再使用全局状态）
  }

  /**
   * 加载蠕虫图片资源
   */
  async loadWormImages() {
    if (this.imagesLoaded) {
      return; // 图片已加载
    }

    return new Promise((resolve, reject) => {
      let loadedCount = 0;
      const totalImages = 3;
      const images = {};

      const checkAllLoaded = () => {
        loadedCount++;
        if (loadedCount === totalImages) {
          this.wormHeadImage = images.head;
          this.wormBodyImage = images.body;
          this.wormTailImage = images.tail;
          this.imagesLoaded = true;
          resolve();
        }
      };

      const handleError = (type) => {
        console.error(`加载蠕虫${type}图片失败`);
        // 即使加载失败也继续，使用默认绘制方式
        checkAllLoaded();
      };

      // 加载头部图片
      const headImg = wx.createImage();
      headImg.onload = () => {
        images.head = headImg;
        checkAllLoaded();
      };
      headImg.onerror = () => handleError('头部');
      headImg.src = 'image/worm_head.png';

      // 加载身体图片
      const bodyImg = wx.createImage();
      bodyImg.onload = () => {
        images.body = bodyImg;
        checkAllLoaded();
      };
      bodyImg.onerror = () => handleError('身体');
      bodyImg.src = 'image/worm_body.png';

      // 加载尾巴图片
      const tailImg = wx.createImage();
      tailImg.onload = () => {
        images.tail = tailImg;
        checkAllLoaded();
      };
      tailImg.onerror = () => handleError('尾巴');
      tailImg.src = 'image/worm_tail.png';
    });
  }

  /**
   * 初始化场景
   * @param {number} levelId - 关卡ID
   */
  async init(levelId) {
    this.currentLevelId = levelId;
    this.failCount = 3;
    this.isGameOver = false;
    this.isVictory = false;
    this.worms = [];
    this.matrix = null; // 初始化为null，表示还未加载完成
    this.escapePoints = [];
    
    // 重置触摸手势状态
    this.touches = [];
    this.isPanning = false;
    this.isDraggingSlider = false;
    this.panOffsetX = 0;
    this.panOffsetY = 0;
    this.zoom = 1.0;

    try {
      // 加载蠕虫图片资源
      await this.loadWormImages();

      // 加载关卡数据
      const levelData = await this.levelManager.loadLevel(levelId);
      this.matrix = levelData.matrix;
      this.escapePoints = levelData.escapePoints;

      // 创建蠕虫对象
      for (const wormConfig of levelData.worms) {
        const worm = new Worm(wormConfig);
        worm.setVisibleSegmentCount(0); // 初始时全部隐藏
        this.worms.push(worm);
      }

      // 计算渲染参数
      this.calculateRenderParams();
      
      // 逐个显示蠕虫（从尾到头）
      await this.animateWormsAppearance();
    } catch (error) {
      console.error('初始化游戏场景失败:', error);
      this.matrix = null;
      throw error; // 重新抛出错误，让上层处理
    }
  }

  /**
   * 动画显示蠕虫（从尾到头逐个显示）
   */
  async animateWormsAppearance() {
    this.isWormsAppearing = true; // 标记正在显示中
    
    const segmentInterval = 5; // 每个段显示的时间间隔（毫秒，加快到最快）
    
    // 找到所有蠕虫的最大段数
    let maxSegments = 0;
    for (const worm of this.worms) {
      maxSegments = Math.max(maxSegments, worm.segments.length);
    }
    
    // 从尾到头逐个显示每个段
    for (let segmentIndex = 1; segmentIndex <= maxSegments; segmentIndex++) {
      // 更新所有蠕虫的可见段数量
      for (const worm of this.worms) {
        if (segmentIndex <= worm.segments.length) {
          worm.setVisibleSegmentCount(segmentIndex);
        }
      }
      
      // 等待间隔时间
      await this.wait(segmentInterval);
    }
    
    // 确保所有蠕虫都完全显示
    for (const worm of this.worms) {
      worm.setVisibleSegmentCount(worm.segments.length);
    }
    
    this.isWormsAppearing = false; // 标记显示完成
  }

  /**
   * 计算渲染参数（适配设计分辨率1080x2340）
   */
  calculateRenderParams() {
    if (!this.matrix) {
      return;
    }
    
    const canvasWidth = this.canvas.width; // 设计分辨率宽度 1080
    const canvasHeight = this.canvas.height; // 设计分辨率高度 2340
    
    // UI区域高度
    const topUIHeight = 160; // 顶部UI高度（增加以容纳两行内容）
    const bottomUIHeight = 100; // 底部UI高度
    
    // 游戏区域高度 = 总高度 - 顶部UI - 底部UI
    const gameAreaHeight = canvasHeight - topUIHeight - bottomUIHeight;
    
    // 左右边距：各50像素
    const horizontalMargin = 100; // 左右各50，总共100
    // 上下边距：各30像素
    const verticalMargin = 60; // 上下各30，总共60
    
    // 基准格子数（15*19）
    const baseWidth = 15;
    const baseHeight = 19;
    
    // 计算基准格子大小（15*19时正好能显示下，不需要缩放）
    // 留出边距：左右各50，上下各30
    const baseMaxCellSizeX = (canvasWidth - horizontalMargin) / baseWidth;
    const baseMaxCellSizeY = (gameAreaHeight - verticalMargin) / baseHeight;
    this.baseCellSize = Math.min(baseMaxCellSizeX, baseMaxCellSizeY);
    
    // 计算当前格子数能完整显示的最大格子大小
    // 确保无论格子数多少，都能完整显示在视口内
    const currentMaxCellSizeX = (canvasWidth - horizontalMargin) / this.matrix.width;
    const currentMaxCellSizeY = (gameAreaHeight - verticalMargin) / this.matrix.height;
    const currentMaxCellSize = Math.min(currentMaxCellSizeX, currentMaxCellSizeY);
    
    // 计算游戏核心区域的缩放比例
    // 缩放比例 = 当前最大格子大小 / 基准格子大小
    // 15*19时缩放比例为1.0，格子数更多时缩小（<1.0），格子数更少时不放大（限制最大为1.0）
    this.gameCoreScale = Math.min(currentMaxCellSize / this.baseCellSize, 1.0) * this.zoom;
    
    // 使用基准格子大小作为实际格子大小（在游戏核心坐标系中）
    // 这样游戏核心坐标系是固定的，通过缩放来适配不同格子数
    this.cellSize = this.baseCellSize;
    
    // 计算游戏核心区域的实际显示大小
    const gameCoreDisplayWidth = this.matrix.width * this.cellSize * this.gameCoreScale;
    const gameCoreDisplayHeight = this.matrix.height * this.cellSize * this.gameCoreScale;
    
    // 计算游戏核心区域的偏移量（居中显示，左右各留50像素边距）
    // 可用宽度 = 总宽度 - 左右边距（各50像素）
    const availableWidth = canvasWidth - horizontalMargin;
    
     // 如果实际显示宽度小于可用宽度，居中显示
     // 如果实际显示宽度大于可用宽度，需要进一步缩小（这种情况理论上不应该发生，因为已经计算了缩放）
     if (gameCoreDisplayWidth <= availableWidth) {
       // 居中显示，左右各留50像素 + 拖动偏移
       this.gameCoreOffsetX = 50 + (availableWidth - gameCoreDisplayWidth) / 2 + this.panOffsetX;
     } else {
       // 如果还是超出，强制缩小（这种情况理论上不应该发生）
       this.gameCoreOffsetX = 50 + this.panOffsetX;
     }
     
     // 垂直居中：在游戏区域内居中（顶部UI下方）+ 拖动偏移
     const availableHeight = gameAreaHeight - verticalMargin;
     this.gameCoreOffsetY = topUIHeight + 30 + (availableHeight - gameCoreDisplayHeight) / 2 + this.panOffsetY;
    
    // 游戏核心区域内的偏移量（用于居中显示）
    this.offsetX = 0;
    this.offsetY = 0;
  }

  /**
   * 世界坐标转屏幕坐标（在游戏核心坐标系中）
   * @param {number} x - 世界X坐标（网格坐标）
   * @param {number} y - 世界Y坐标（网格坐标）
   * @returns {Object} 屏幕坐标 {x, y}（在游戏核心坐标系中）
   * 注意：返回的是单元格中心的位置，这样蠕虫会绘制在单元格中心
   */
  worldToScreen(x, y) {
    return {
      x: this.offsetX + (x + 0.5) * this.cellSize,
      y: this.offsetY + (y + 0.5) * this.cellSize
    };
  }

  /**
   * 屏幕坐标转世界坐标（考虑游戏核心区域的缩放和偏移）
   * @param {number} x - 屏幕X坐标（设计分辨率坐标系）
   * @param {number} y - 屏幕Y坐标（设计分辨率坐标系）
   * @returns {Object} 世界坐标 {x, y}
   */
  screenToWorld(x, y) {
    // 先转换到游戏核心坐标系
    const gameCoreX = (x - this.gameCoreOffsetX) / this.gameCoreScale;
    const gameCoreY = (y - this.gameCoreOffsetY) / this.gameCoreScale;
    
    // 再转换到世界坐标
    return {
      x: Math.floor((gameCoreX - this.offsetX) / this.cellSize),
      y: Math.floor((gameCoreY - this.offsetY) / this.cellSize)
    };
  }

  /**
   * 处理点击事件
   * @param {number} x - 点击X坐标（设计分辨率坐标）
   * @param {number} y - 点击Y坐标（设计分辨率坐标）
   */
  handleClick(x, y) {
    if (this.isGameOver || this.isVictory) {
      return;
    }
    
    // 如果蠕虫正在显示中，禁止点击
    if (this.isWormsAppearing) {
      return;
    }

    // 如果正在拖动地图，不处理点击
    if (this.isPanning) {
      return;
    }

    // 检查是否点击了底部滑块
    if (this.checkSliderClick(x, y)) {
      return;
    }

    // 检查是否点击了UI按钮
    if (this.checkUIButtonClick(x, y)) {
      return;
    }

    // 使用屏幕坐标直接查找蠕虫（更准确，考虑视觉范围）
    const clickedWorm = this.findWormAtScreenPosition(x, y);
    if (!clickedWorm || clickedWorm.hasEscaped()) {
      return;
    }

    // 检查该蠕虫是否正在移动，如果是则忽略点击
    if (clickedWorm.isAnimating) {
      return;
    }

    // 处理蠕虫移动
    this.handleWormClick(clickedWorm);
  }

  /**
   * 处理触摸开始事件
   * @param {Array} touches - 触摸点数组（设计分辨率坐标）
   */
  handleTouchStart(touches) {
    if (this.isGameOver || this.isVictory) {
      return;
    }

    this.touches = touches.map(t => ({
      id: t.identifier || t.id || 0,
      x: t.x,
      y: t.y
    }));

    if (this.touches.length === 1) {
      // 单指：检查是否点击了滑块
      const touch = this.touches[0];
      if (this.checkSliderClick(touch.x, touch.y)) {
        // 点击了滑块，开始拖动
        this.isDraggingSlider = true;
        return;
      }
      
      // 记录起始位置，等待移动事件判断是拖动还是点击
      this.isPanning = false;
      this.panStartX = this.touches[0].x;
      this.panStartY = this.touches[0].y;
    } else if (this.touches.length === 2) {
      // 双指：准备缩放
      this.isPanning = false;
      this.isDraggingSlider = false; // 双指时停止滑块拖动
      this.initialZoom = this.zoom;
      this.initialDistance = this.getTouchDistance(this.touches[0], this.touches[1]);
    }
  }

  /**
   * 处理触摸移动事件
   * @param {Array} touches - 触摸点数组（设计分辨率坐标）
   */
  handleTouchMove(touches) {
    if (this.isGameOver || this.isVictory) {
      return;
    }

    const currentTouches = touches.map(t => ({
      id: t.identifier || t.id || 0,
      x: t.x,
      y: t.y
    }));

    // 如果正在拖动滑块，优先处理滑块拖动
    if (this.isDraggingSlider && currentTouches.length === 1) {
      this.handleSliderDrag(currentTouches[0].x);
      this.touches = currentTouches;
      return;
    }

    if (currentTouches.length === 1 && this.touches.length >= 1) {
      // 单指拖动地图
      const touch = currentTouches[0];
      const deltaX = touch.x - this.panStartX;
      const deltaY = touch.y - this.panStartY;
      
      // 如果移动距离超过阈值，认为是拖动而不是点击
      const moveDistance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
      if (moveDistance > 5) { // 5像素阈值
        this.isPanning = true;
        this.panOffsetX += deltaX;
        this.panOffsetY += deltaY;
        
        this.panStartX = touch.x;
        this.panStartY = touch.y;
        
        this.calculateRenderParams();
      }
    } else if (currentTouches.length === 2 && this.touches.length >= 2) {
      // 双指缩放
      this.isPanning = false;
      this.isDraggingSlider = false; // 双指时停止滑块拖动
      const currentDistance = this.getTouchDistance(currentTouches[0], currentTouches[1]);
      if (this.initialDistance > 0) {
        const scale = currentDistance / this.initialDistance;
        this.zoom = Math.max(this.minZoom, Math.min(this.maxZoom, this.initialZoom * scale));
        this.calculateRenderParams();
      }
    }

    this.touches = currentTouches;
  }

  /**
   * 处理触摸结束事件
   * @param {Array} touches - 剩余的触摸点数组（设计分辨率坐标）
   */
  handleTouchEnd(touches) {
    // 停止滑块拖动
    if (this.isDraggingSlider) {
      this.stopSliderDrag();
    }

    const remainingTouches = (touches || []).map(t => ({
      id: t.identifier || t.id || 0,
      x: t.x,
      y: t.y
    }));

    if (remainingTouches.length === 0) {
      // 所有触摸点都释放了
      const wasPanning = this.isPanning;
      this.isPanning = false;
      this.touches = [];
      
      // 如果之前没有拖动（只是点击），且触摸点移动距离很小，触发点击事件
      if (!wasPanning && this.touches.length === 0) {
        // 点击事件会在handleTouchStart中处理（单点触摸）
        // 这里不需要额外处理
      }
    } else if (remainingTouches.length === 1 && this.touches.length >= 2) {
      // 从双指变为单指，切换到拖动模式
      this.isPanning = false;
      this.panStartX = remainingTouches[0].x;
      this.panStartY = remainingTouches[0].y;
      this.touches = remainingTouches;
    } else {
      this.touches = remainingTouches;
    }
  }

  /**
   * 计算两个触摸点之间的距离
   * @param {Object} touch1 - 触摸点1
   * @param {Object} touch2 - 触摸点2
   * @returns {number} 距离
   */
  getTouchDistance(touch1, touch2) {
    const dx = touch2.x - touch1.x;
    const dy = touch2.y - touch1.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  /**
   * 检查是否点击了底部滑块
   * @param {number} x - 屏幕X坐标（设计分辨率坐标）
   * @param {number} y - 屏幕Y坐标（设计分辨率坐标）
   * @returns {boolean}
   */
  checkSliderClick(x, y) {
    const width = this.canvas.width;
    const height = this.canvas.height;
    const bottomBarHeight = 100;
    const sliderX = width / 2;
    const sliderY = height - bottomBarHeight / 2;
    const sliderWidth = 400;
    const sliderHeight = 8;
    const handleSize = 40;
    const buttonSize = 60;

    // 检查是否点击了减号按钮
    const minusX = sliderX - sliderWidth / 2 - 60;
    if (x >= minusX - buttonSize / 2 && x <= minusX + buttonSize / 2 &&
        y >= sliderY - buttonSize / 2 && y <= sliderY + buttonSize / 2) {
      this.zoomOut();
      return true;
    }

    // 检查是否点击了加号按钮
    const plusX = sliderX + sliderWidth / 2 + 60;
    if (x >= plusX - buttonSize / 2 && x <= plusX + buttonSize / 2 &&
        y >= sliderY - buttonSize / 2 && y <= sliderY + buttonSize / 2) {
      this.zoomIn();
      return true;
    }

    // 检查是否点击了滑块轨道或手柄
    const sliderLeft = sliderX - sliderWidth / 2;
    const sliderRight = sliderX + sliderWidth / 2;
    const sliderTop = sliderY - Math.max(handleSize / 2, 20);
    const sliderBottom = sliderY + Math.max(handleSize / 2, 20);

    if (x >= sliderLeft && x <= sliderRight && y >= sliderTop && y <= sliderBottom) {
      // 点击了滑块区域，开始拖动
      this.isDraggingSlider = true;
      this.updateZoomFromSliderX(x);
      return true;
    }

    return false;
  }

  /**
   * 根据滑块X坐标更新缩放值
   * @param {number} sliderX - 滑块X坐标（设计分辨率坐标）
   */
  updateZoomFromSliderX(sliderX) {
    const width = this.canvas.width;
    const sliderCenterX = width / 2;
    const sliderWidth = 400;
    const sliderLeft = sliderCenterX - sliderWidth / 2;
    const sliderRight = sliderCenterX + sliderWidth / 2;

    // 计算滑块位置比例 (0 到 1)
    let ratio = (sliderX - sliderLeft) / sliderWidth;
    ratio = Math.max(0, Math.min(1, ratio));

    // 将比例转换为缩放值
    const zoomRange = this.maxZoom - this.minZoom;
    this.zoom = this.minZoom + ratio * zoomRange;
    this.calculateRenderParams();
  }

  /**
   * 放大
   */
  zoomIn() {
    const step = 0.1;
    this.setZoom(this.zoom + step);
  }

  /**
   * 缩小
   */
  zoomOut() {
    const step = 0.1;
    this.setZoom(this.zoom - step);
  }

  /**
   * 处理滑块拖动
   * @param {number} x - 当前X坐标（设计分辨率坐标）
   */
  handleSliderDrag(x) {
    if (this.isDraggingSlider) {
      this.updateZoomFromSliderX(x);
    }
  }

  /**
   * 停止滑块拖动
   */
  stopSliderDrag() {
    this.isDraggingSlider = false;
  }

  /**
   * 检查是否点击了UI按钮
   * @param {number} x - 屏幕X坐标（设计分辨率坐标）
   * @param {number} y - 屏幕Y坐标（设计分辨率坐标）
   * @returns {boolean}
   */
  checkUIButtonClick(x, y) {
    const canvasWidth = this.canvas.width;
    
    // 检查设置按钮（右上角）
    if (x > canvasWidth - 50 && x < canvasWidth - 10 && y > 10 && y < 50) {
      // TODO: 打开设置菜单
      return true;
    }

    return false;
  }

  /**
   * 查找指定位置的蠕虫
   * 检查点击位置是否在蠕虫的某个段的范围内
   * @param {Object} position - 位置 {x, y} (世界坐标)
   * @returns {Worm|null}
   */
  findWormAtPosition(position) {
    for (const worm of this.worms) {
      if (worm.hasEscaped()) continue;

      const segments = worm.getAllSegments();
      for (const segment of segments) {
        // 检查点击位置是否在这个段的范围内（允许一定的容差）
        if (segment.x === position.x && segment.y === position.y) {
          return worm;
        }
      }
    }
    return null;
  }
  
  /**
   * 查找点击位置附近的蠕虫（使用屏幕坐标，更准确）
   * @param {number} screenX - 屏幕X坐标（设计分辨率坐标系）
   * @param {number} screenY - 屏幕Y坐标（设计分辨率坐标系）
   * @returns {Worm|null}
   */
  findWormAtScreenPosition(screenX, screenY) {
    // 将设计分辨率坐标转换为游戏核心坐标系坐标
    const gameCoreX = (screenX - this.gameCoreOffsetX) / this.gameCoreScale;
    const gameCoreY = (screenY - this.gameCoreOffsetY) / this.gameCoreScale;
    
    const segmentRadius = this.cellSize * 0.4;
    const clickRadius = segmentRadius * 1.5; // 扩大点击范围，提高点击成功率
    
    for (const worm of this.worms) {
      if (worm.hasEscaped()) continue;

      const segments = worm.getAllSegments();
      for (const segment of segments) {
        // worldToScreen 返回的是游戏核心坐标系坐标
        const gameCorePos = this.worldToScreen(segment.x, segment.y);
        const distance = Math.sqrt(
          Math.pow(gameCoreX - gameCorePos.x, 2) + 
          Math.pow(gameCoreY - gameCorePos.y, 2)
        );
        
        if (distance <= clickRadius) {
          return worm;
        }
      }
    }
    return null;
  }

  /**
   * 处理蠕虫点击
   * 根据需求文档：
   * 1. 如果可逃脱：沿着路径自动移动到逃脱
   * 2. 如果不可逃脱：移动一步，如果碰撞则高亮警示并复位
   * @param {Worm} worm - 被点击的蠕虫
   */
  async handleWormClick(worm) {
    this.audioManager.playSound('click');

    // 获取障碍物（其他蠕虫的身体段）
    const obstacles = this.getObstacles(worm);

    // 查找逃脱路径（沿着头部方向到边界的直线路径）
    const result = PathFinder.findPath(worm, this.matrix, obstacles, this.escapePoints);

    if (result && result.canEscape && result.path && result.path.length > 0) {
      // 可以逃脱：沿着路径自动移动
      await this.moveWormToEscape(worm, result.path);
    } else if (result && !result.canEscape && result.pathToObstacle) {
      // 不可逃脱：蠕动到阻挡位 → 高亮闪动 → 蠕动回初始位
      await this.moveWormToObstacleAndBack(worm, result.pathToObstacle);
    } else {
      // 无法移动（已经在边界或障碍物旁）
      await this.tryMoveWormOneStep(worm);
    }
  }

  /**
   * 检查蠕虫是否完全在视口外
   * @param {Worm} worm - 蠕虫对象
   * @returns {boolean} 是否在视口外
   */
  isWormOutsideViewport(worm) {
    const segments = worm.getInterpolatedSegments();
    const segmentRadius = this.cellSize * 0.4;
    const margin = segmentRadius * 2; // 增加一些边距，确保完全离开视口
    
    for (const segment of segments) {
      const screenPos = this.worldToScreen(segment.x, segment.y);
      // 检查是否在视口内（包括边距）
      if (screenPos.x + margin >= 0 && 
          screenPos.x - margin < this.canvas.width &&
          screenPos.y + margin >= 0 && 
          screenPos.y - margin < this.canvas.height) {
        return false; // 至少有一个段在视口内
      }
    }
    return true; // 所有段都在视口外
  }

  /**
   * 移动蠕虫逃脱
   * @param {Worm} worm - 蠕虫对象
   * @param {Array} path - 逃脱路径
   */
  async moveWormToEscape(worm, path) {
    // 调试：输出路径信息
    console.log('蠕虫逃脱路径调试:', {
      wormId: worm.id,
      headPos: worm.getHeadPosition(),
      direction: worm.direction,
      path: path,
      segments: worm.getAllSegments()
    });

    // 标记蠕虫正在逃脱（在整个逃脱过程中不参与阻挡）
    worm.isEscaping = true;

    // 保存初始位置（用于碰撞后归位）
    const originalSegments = JSON.parse(JSON.stringify(worm.getAllSegments()));
    const originalHeadPos = originalSegments[0];

    // 逐步移动（使用平滑动画）
    const moveDuration = 8; // 每步移动时间（速度加快20倍：5倍*4倍）
    const direction = PathFinder.getDirectionVector(worm.direction);
    
    for (let i = 0; i < path.length; i++) {
      const nextPos = path[i];
      console.log(`移动步骤 ${i}:`, {
        from: worm.getHeadPosition(),
        to: nextPos,
        segmentsBefore: JSON.parse(JSON.stringify(worm.getAllSegments()))
      });
      
      // 在移动前实时检查碰撞（因为其他蠕虫的状态可能在移动过程中改变）
      const willCollide = CollisionDetector.checkCollision(worm, nextPos, this.worms);
      if (willCollide) {
        // 检测到碰撞，执行归位逻辑：移动到阻挡位 → 高亮闪动 → 回到初始位
        console.log(`蠕虫 ${worm.id} 在移动步骤 ${i} 检测到碰撞，执行归位逻辑`);
        
        // 1. 移动到阻挡位置
        worm.startMoveAnimation(nextPos, moveDuration);
        this.audioManager.playSound('collision');
        // 添加震动效果（加强）
        if (typeof wx !== 'undefined' && wx.vibrateShort) {
          wx.vibrateShort({
            type: 'heavy' // 高强度震动
          });
        }
        await this.waitForAnimation(worm, moveDuration);
        worm.completeAnimation();
        
        // 2. 高亮闪动一下
        await new Promise((resolve) => {
          this.effectManager.createHighlightAnimation(worm, () => {
            resolve();
          });
        });
        
        // 3. 回到初始位（反向移动）
        const currentHeadPos = worm.getHeadPosition();
        const reverseDirection = {
          x: -direction.x,
          y: -direction.y
        };
        
        const backPos = {
          x: currentHeadPos.x + reverseDirection.x,
          y: currentHeadPos.y + reverseDirection.y
        };
        
        // 移动到初始位置
        worm.startMoveAnimation(backPos, moveDuration);
        await this.waitForAnimation(worm, moveDuration);
        worm.completeAnimation();
        
        // 确保回到精确的初始位置
        worm.reset(); // reset 方法会重置 isEscaping
        
        // 减少失败次数
        this.failCount--;
        if (this.failCount <= 0) {
          this.gameOver();
        }
        
        return; // 停止移动，不继续逃脱
      }
      
      // 开始移动动画
      worm.startMoveAnimation(nextPos, moveDuration);
      this.audioManager.playSound('move');
      
      // 等待动画完成（使用更精确的等待方式）
      await this.waitForAnimation(worm, moveDuration);
      
      // 确保动画已完成
      worm.completeAnimation();
      
      console.log(`移动步骤 ${i} 后:`, {
        headPos: worm.getHeadPosition(),
        segmentsAfter: JSON.parse(JSON.stringify(worm.getAllSegments()))
      });
    }

    // 继续移动直到蠕虫完全离开视口
    let headPos = worm.getHeadPosition();
    while (!this.isWormOutsideViewport(worm)) {
      // 继续向逃脱方向移动
      const nextPos = {
        x: headPos.x + direction.x,
        y: headPos.y + direction.y
      };
      
      // 在移动前实时检查碰撞（因为其他蠕虫的状态可能在移动过程中改变）
      const willCollide = CollisionDetector.checkCollision(worm, nextPos, this.worms);
      if (willCollide) {
        // 检测到碰撞，执行归位逻辑：移动到阻挡位 → 高亮闪动 → 回到初始位
        console.log(`蠕虫 ${worm.id} 在离开视口过程中检测到碰撞，执行归位逻辑`);
        
        // 1. 移动到阻挡位置
        worm.startMoveAnimation(nextPos, moveDuration);
        this.audioManager.playSound('collision');
        // 添加震动效果（加强）
        if (typeof wx !== 'undefined' && wx.vibrateShort) {
          wx.vibrateShort({
            type: 'heavy' // 高强度震动
          });
        }
        await this.waitForAnimation(worm, moveDuration);
        worm.completeAnimation();
        
        // 2. 高亮闪动一下
        await new Promise((resolve) => {
          this.effectManager.createHighlightAnimation(worm, () => {
            resolve();
          });
        });
        
        // 3. 回到初始位（反向移动）
        const currentHeadPos = worm.getHeadPosition();
        const reverseDirection = {
          x: -direction.x,
          y: -direction.y
        };
        
        const backPos = {
          x: currentHeadPos.x + reverseDirection.x,
          y: currentHeadPos.y + reverseDirection.y
        };
        
        // 移动到初始位置
        worm.startMoveAnimation(backPos, moveDuration);
        await this.waitForAnimation(worm, moveDuration);
        worm.completeAnimation();
        
        // 确保回到精确的初始位置
        worm.reset();
        
        // 减少失败次数
        this.failCount--;
        if (this.failCount <= 0) {
          this.gameOver();
        }
        
        return; // 停止移动
      }
      
      worm.startMoveAnimation(nextPos, moveDuration);
      await this.waitForAnimation(worm, moveDuration);
      worm.completeAnimation();
      
      headPos = worm.getHeadPosition();
    }

    // 蠕虫已完全离开视口，标记为逃脱
    worm.isEscaping = false; // 逃脱完成，重置逃脱状态
    worm.markEscaped();
    this.audioManager.playSound('escape');
    const lastHeadPos = worm.getHeadPosition();
    this.effectManager.createEscapeEffect(
      this.worldToScreen(lastHeadPos.x, lastHeadPos.y),
      worm.color
    );

    // 检查是否胜利
    this.checkVictory();
  }

  /**
   * 移动蠕虫到阻挡位置，然后返回初始位置
   * 流程：1.蠕动到阻挡位 → 2.高亮闪动 → 3.蠕动回初始位
   * @param {Worm} worm - 蠕虫对象
   * @param {Array} pathToObstacle - 到障碍物的路径
   */
  async moveWormToObstacleAndBack(worm, pathToObstacle) {
    // 保存初始位置
    const originalSegments = JSON.parse(JSON.stringify(worm.getAllSegments()));
    
    // 1. 蠕动到阻挡位（沿着路径移动）
    // 如果路径为空，说明已经在障碍物旁边，只移动一步
    const direction = PathFinder.getDirectionVector(worm.direction);
    const headPos = worm.getHeadPosition();
    
    const moveDuration = 6; // 移动动画时间（速度加快20倍：5倍*4倍）
    if (pathToObstacle.length === 0) {
      // 直接移动一步到阻挡位
      const nextPos = {
        x: headPos.x + direction.x,
        y: headPos.y + direction.y
      };
      worm.startMoveAnimation(nextPos, moveDuration);
      await this.waitForAnimation(worm, moveDuration);
      worm.completeAnimation();
    } else {
      // 沿着路径移动到阻挡位置（最后一步+再前进一步到障碍物）
      for (let i = 0; i < pathToObstacle.length; i++) {
        const nextPos = pathToObstacle[i];
        worm.startMoveAnimation(nextPos, moveDuration);
        await this.waitForAnimation(worm, moveDuration);
        worm.completeAnimation();
      }
      // 再移动一步到阻挡位置
      const lastPos = pathToObstacle[pathToObstacle.length - 1];
      const obstaclePos = {
        x: lastPos.x + direction.x,
        y: lastPos.y + direction.y
      };
      worm.startMoveAnimation(obstaclePos, moveDuration);
      await this.waitForAnimation(worm, moveDuration);
      worm.completeAnimation();
    }
    
    this.audioManager.playSound('collision');
    // 添加震动效果（加强）
    if (typeof wx !== 'undefined' && wx.vibrateShort) {
      wx.vibrateShort({
        type: 'heavy' // 高强度震动
      });
    }
    
    // 2. 高亮闪动一下
    await new Promise((resolve) => {
      this.effectManager.createHighlightAnimation(worm, () => {
        resolve();
      });
    });
    
    // 3. 蠕动回初始位（反向移动）
    // 计算返回路径（反向）
    const returnPath = [];
    const currentHeadPos = worm.getHeadPosition();
    const originalHeadPos = originalSegments[0];
    
    // 计算返回步数
    const stepsBack = Math.abs(currentHeadPos.x - originalHeadPos.x) + 
                      Math.abs(currentHeadPos.y - originalHeadPos.y);
    
    let currentX = currentHeadPos.x;
    let currentY = currentHeadPos.y;
    
    for (let i = 0; i < stepsBack; i++) {
      currentX -= direction.x;
      currentY -= direction.y;
      returnPath.push({ x: currentX, y: currentY });
    }
    
    // 沿着返回路径移动
    for (let i = 0; i < returnPath.length; i++) {
      const pos = returnPath[i];
      worm.startMoveAnimation(pos, moveDuration);
      await this.waitForAnimation(worm, moveDuration);
      worm.completeAnimation();
    }
    
    // 确保精确回到初始位置
    worm.reset();

    // 减少失败次数
    this.failCount--;
    if (this.failCount <= 0) {
      this.gameOver();
    }
  }

  /**
   * 尝试移动蠕虫一步（不可逃脱情况，备用方法）
   * @param {Worm} worm - 蠕虫对象
   */
  async tryMoveWormOneStep(worm) {
    const headPos = worm.getHeadPosition();
    const direction = PathFinder.getDirectionVector(worm.direction);
    
    // 调试：输出头部位置和方向
    console.log('蠕虫移动调试:', {
      wormId: worm.id,
      headPos: headPos,
      direction: worm.direction,
      directionVector: direction,
      nextPos: {
        x: headPos.x + direction.x,
        y: headPos.y + direction.y
      },
      segments: worm.getAllSegments()
    });
    
    const nextPos = {
      x: headPos.x + direction.x,
      y: headPos.y + direction.y
    };

    // 检查边界
    if (!CollisionDetector.isInBounds(nextPos, this.matrix)) {
      // 超出边界，继续移动直到离开视口
      const direction = PathFinder.getDirectionVector(worm.direction);
      const moveDuration = 8;
      
      // 移动到边界外
      worm.moveTo(nextPos);
      
      // 继续移动直到完全离开视口
      let currentPos = nextPos;
      while (!this.isWormOutsideViewport(worm)) {
        currentPos = {
          x: currentPos.x + direction.x,
          y: currentPos.y + direction.y
        };
        worm.startMoveAnimation(currentPos, moveDuration);
        await this.waitForAnimation(worm, moveDuration);
        worm.completeAnimation();
      }
      
      // 蠕虫已完全离开视口，标记为逃脱
      worm.isEscaping = false; // 逃脱完成，重置逃脱状态
      worm.markEscaped();
      this.audioManager.playSound('escape');
      this.effectManager.createEscapeEffect(
        this.worldToScreen(worm.getHeadPosition().x, worm.getHeadPosition().y),
        worm.color
      );
      this.checkVictory();
      return;
    }

    // 检查碰撞（预测下一步是否会碰撞）
    const willCollide = CollisionDetector.checkCollision(worm, nextPos, this.worms);

    if (willCollide) {
      // 会碰撞：1.蠕动到阻挡位 → 2.高亮闪动 → 3.蠕动回到初始位
      
      // 保存初始位置
      const originalSegments = JSON.parse(JSON.stringify(worm.getAllSegments()));
      
      // 1. 蠕动到阻挡位（使用动画）
      
      // 移动到阻挡位置
      const moveDuration = 6;
      worm.startMoveAnimation(nextPos, moveDuration);
      this.audioManager.playSound('collision');
      // 添加震动效果（加强）
      if (typeof wx !== 'undefined' && wx.vibrateShort) {
        wx.vibrateShort({
          type: 'heavy' // 高强度震动
        });
      }
      await this.waitForAnimation(worm, moveDuration);
      worm.completeAnimation();
      
      // 2. 高亮闪动一下
      await new Promise((resolve) => {
        this.effectManager.createHighlightAnimation(worm, () => {
          resolve();
        });
      });
      
      // 3. 蠕动回到初始位（使用动画）
      // 直接使用 reset 会立即回到初始位置，我们需要动画效果
      // 计算回到初始位置的路径（反向移动）
      const currentHeadPos = worm.getHeadPosition();
      const originalHeadPos = originalSegments[0];
      
      // 反向移动一步回到初始位置
      const reverseDirection = {
        x: -direction.x,
        y: -direction.y
      };
      
      const backPos = {
        x: currentHeadPos.x + reverseDirection.x,
        y: currentHeadPos.y + reverseDirection.y
      };
      
      // 移动到初始位置
      worm.startMoveAnimation(backPos, moveDuration);
      await this.waitForAnimation(worm, moveDuration);
      worm.completeAnimation();
      
      // 确保回到精确的初始位置
      worm.reset();

      // 减少失败次数
      this.failCount--;
      if (this.failCount <= 0) {
        this.gameOver();
      }
    } else {
      // 不会碰撞：正常移动一步（使用动画）
      // 注意：这种情况理论上不应该发生，因为已经判定为"不可逃脱"
      // 但为了代码健壮性，还是处理这种情况
      const moveDuration = 8;
      worm.startMoveAnimation(nextPos, moveDuration);
      this.audioManager.playSound('move');
      await this.waitForAnimation(worm, moveDuration);
      worm.completeAnimation();
    }
  }

  /**
   * 获取障碍物位置数组
   * @param {Worm} excludeWorm - 排除的蠕虫
   * @returns {Array} 障碍物位置数组
   */
  getObstacles(excludeWorm) {
    const obstacles = [];
    for (const worm of this.worms) {
      if (worm.id === excludeWorm.id || worm.hasEscaped()) {
        continue;
      }
      // 跳过正在逃脱的蠕虫（一旦开始逃脱，在整个过程中都不参与阻挡）
      if (worm.isEscaping) {
        continue;
      }
      // 跳过正在移动的蠕虫（移动中的蠕虫可以被穿透）
      // 只有静止的蠕虫才作为障碍物
      if (worm.isAnimating) {
        continue;
      }
      // 包括所有段（头部和身体段），因为头部也应该阻挡其他蠕虫
      const allSegments = worm.getAllSegments();
      obstacles.push(...allSegments);
    }
    return obstacles;
  }

  /**
   * 检查是否胜利
   */
  checkVictory() {
    const allEscaped = this.worms.every(worm => worm.hasEscaped());
    if (allEscaped) {
      this.victory();
    }
  }

  /**
   * 胜利处理
   */
  victory() {
    this.isVictory = true;
    this.isGameOver = true;
    this.audioManager.playSound('victory');
    
    // 创建胜利特效
    this.effectManager.createVictoryEffect({
      x: this.canvas.width / 2,
      y: this.canvas.height / 2
    });

    // 保存进度
    this.game.storageManager.completeLevel(this.currentLevelId);

    // 延迟显示结果
    setTimeout(() => {
      this.game.showResult(true);
    }, 2000);
  }

  /**
   * 游戏失败处理
   */
  gameOver() {
    this.isGameOver = true;
    this.audioManager.playSound('fail');
    
    // 延迟显示结果
    setTimeout(() => {
      this.game.showResult(false);
    }, 1000);
  }

  /**
   * 等待指定时间
   * @param {number} ms - 毫秒数
   * @returns {Promise}
   */
  wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * 等待动画完成（更精确的等待方式，确保动画流畅）
   * @param {Worm} worm - 蠕虫对象
   * @param {number} maxDuration - 最大等待时间（毫秒）
   * @returns {Promise}
   */
  async waitForAnimation(worm, maxDuration) {
    const startTime = Date.now();
    // 每帧检查动画是否完成，最多等待maxDuration + 缓冲时间
    while (worm.isAnimating && (Date.now() - startTime) < maxDuration + 50) {
      await this.wait(16); // 等待一帧（约60fps），确保动画更新流畅
    }
  }

  /**
   * 设置缩放
   * @param {number} zoom - 缩放比例
   */
  setZoom(zoom) {
    this.zoom = Math.max(this.minZoom, Math.min(this.maxZoom, zoom));
    this.calculateRenderParams();
  }

  /**
   * 渲染场景
   */
  render() {
    const ctx = this.ctx;
    const width = this.canvas.width;
    const height = this.canvas.height;

    // 清空画布
    ctx.clearRect(0, 0, width, height);

    // 绘制背景
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, width, height);

    // 如果矩阵数据未加载，只显示加载提示
    if (!this.matrix) {
      ctx.fillStyle = '#666666';
      ctx.font = '24px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('加载关卡中...', width / 2, height / 2);
      return;
    }

    // 绘制顶部UI
    this.renderTopUI();

    // 绘制游戏区域
    this.renderGameArea();

    // 绘制底部UI
    this.renderBottomUI();

    // 绘制特效
    this.effectManager.update((x, y) => {
      return this.worldToScreen(x, y);
    });

    // 绘制胜利/失败遮罩
    if (this.isVictory || (this.isGameOver && !this.isVictory)) {
      this.renderGameOverOverlay();
    }
  }

  /**
   * 渲染顶部UI（适配设计分辨率1080x2340）
   */
  renderTopUI() {
    const ctx = this.ctx;
    const width = this.canvas.width;   // 1080
    const topBarHeight = 160; // 顶部栏高度（增加高度以容纳两行内容）

    // 背景
    ctx.fillStyle = '#E3F2FD';
    ctx.fillRect(0, 0, width, topBarHeight);
    
    // 底部边框线
    ctx.strokeStyle = '#BBDEFB';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, topBarHeight);
    ctx.lineTo(width, topBarHeight);
    ctx.stroke();

    // 第一行：关卡名称和设置按钮
    const firstLineY = 50; // 第一行垂直位置
    
    // 关卡名称
    ctx.fillStyle = '#1976D2';
    ctx.font = 'bold 48px Arial';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText(`关卡${this.currentLevelId}`, 40, firstLineY);

    // 设置按钮
    ctx.fillStyle = '#666666';
    ctx.font = '48px Arial';
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';
    ctx.fillText('⚙', width - 40, firstLineY);

    // 第二行：失败次数（红心）
    const secondLineY = 110; // 第二行垂直位置
    const heartSize = 48;
    const heartSpacing = 60;
    const totalHeartsWidth = 3 * heartSpacing;
    const heartStartX = width / 2 - totalHeartsWidth / 2;
    
    for (let i = 0; i < 3; i++) {
      const x = heartStartX + i * heartSpacing;
      const y = secondLineY;
      ctx.fillStyle = i < this.failCount ? '#F44336' : '#CCCCCC';
      ctx.font = `${heartSize}px Arial`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('♥', x, y);
    }
    
    // 重置textBaseline
    ctx.textBaseline = 'alphabetic';
  }

  /**
   * 渲染游戏区域
   */
  renderGameArea() {
    const ctx = this.ctx;

    // 检查矩阵数据是否已加载
    if (!this.matrix) {
      // 显示加载中提示
      ctx.fillStyle = '#666666';
      ctx.font = '24px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('加载中...', this.canvas.width / 2, this.canvas.height / 2);
      return;
    }

    // 保存画布状态
    ctx.save();
    
    // 应用游戏核心区域的变换（父节点）
    // 1. 平移到游戏核心区域位置
    ctx.translate(this.gameCoreOffsetX, this.gameCoreOffsetY);
    // 2. 应用缩放
    ctx.scale(this.gameCoreScale, this.gameCoreScale);

    // 绘制网格
    // 注意：网格应该在游戏核心坐标系中绘制，从 (0, 0) 开始
    // 网格的绘制范围应该是 this.matrix.width * this.cellSize 和 this.matrix.height * this.cellSize
    ctx.strokeStyle = '#E0E0E0';
    ctx.lineWidth = 1;
    
    // 绘制垂直网格线
    for (let x = 0; x <= this.matrix.width; x++) {
      const screenX = this.offsetX + x * this.cellSize;
      const startY = this.offsetY;
      const endY = this.offsetY + this.matrix.height * this.cellSize;
      ctx.beginPath();
      ctx.moveTo(screenX, startY);
      ctx.lineTo(screenX, endY);
      ctx.stroke();
    }
    
    // 绘制水平网格线
    for (let y = 0; y <= this.matrix.height; y++) {
      const screenY = this.offsetY + y * this.cellSize;
      const startX = this.offsetX;
      const endX = this.offsetX + this.matrix.width * this.cellSize;
      ctx.beginPath();
      ctx.moveTo(startX, screenY);
      ctx.lineTo(endX, screenY);
      ctx.stroke();
    }

    // 绘制蠕虫
    for (const worm of this.worms) {
      if (worm.hasEscaped()) continue;
      this.renderWorm(worm);
    }
    
    // 恢复画布状态（结束游戏核心区域的变换）
    ctx.restore();
  }

  /**
   * 获取方向对应的旋转角度（弧度）
   * @param {string} direction - 方向 (up/down/left/right)
   * @returns {number} 旋转角度（弧度）
   */
  getDirectionAngle(direction) {
    // 假设图片默认朝向是right
    switch (direction) {
      case 'right':
        return 0;
      case 'left':
        return Math.PI;
      case 'up':
        return -Math.PI / 2;
      case 'down':
        return Math.PI / 2;
      default:
        return 0;
    }
  }

  /**
   * 渲染蠕虫
   * @param {Worm} worm - 蠕虫对象
   */
  renderWorm(worm) {
    const ctx = this.ctx;
    // 使用插值后的段位置实现平滑移动
    const allSegments = worm.getInterpolatedSegments();
    // 获取可见的段数量（用于逐个显示效果）
    const visibleSegmentCount = worm.visibleSegmentCount !== undefined 
      ? worm.visibleSegmentCount 
      : allSegments.length;
    // 只渲染可见的段（从尾到头）
    const segments = visibleSegmentCount >= allSegments.length 
      ? allSegments 
      : allSegments.slice(-visibleSegmentCount);

    // 高亮效果
    if (worm.isHighlighted) {
      ctx.shadowBlur = 10;
      ctx.shadowColor = '#F44336';
    } else {
      ctx.shadowBlur = 0;
    }

    // 如果图片已加载，使用图片绘制
    if (this.imagesLoaded && this.wormHeadImage && this.wormBodyImage && this.wormTailImage) {
      // 计算尾巴方向（从尾巴指向倒数第二个段）
      let tailDirection = null;
      if (segments.length >= 2) {
        const tail = segments[segments.length - 1];
        const prevSegment = segments[segments.length - 2];
        const dx = prevSegment.x - tail.x;
        const dy = prevSegment.y - tail.y;
        
        // 计算方向角度
        if (dx > 0) {
          tailDirection = 'right';
        } else if (dx < 0) {
          tailDirection = 'left';
        } else if (dy > 0) {
          tailDirection = 'down';
        } else if (dy < 0) {
          tailDirection = 'up';
        }
      }
      
      // 图层顺序：从下到上绘制（尾、身N、...、身2、身1、头），这样头部在最上层
      // 按照索引从后往前的顺序绘制：length-1, length-2, ..., 1, 0
      
      // 先绘制尾巴（最下层）
      if (segments.length > 1) {
        const tailIndex = segments.length - 1;
        const tailSegment = segments[tailIndex];
        const screenPos = this.worldToScreen(tailSegment.x, tailSegment.y);
        
        ctx.save();
        ctx.translate(screenPos.x, screenPos.y);
        
        // 计算尾巴旋转角度
        let tailRotation = 0;
        if (tailDirection) {
          tailRotation = this.getDirectionAngle(tailDirection);
        } else {
          // 如果没有方向，使用与头部相反的方向
          const headAngle = this.getDirectionAngle(worm.direction);
          tailRotation = headAngle + Math.PI;
        }
        
        if (tailRotation !== 0) {
          ctx.rotate(tailRotation);
        }
        
        const imgWidth = this.wormTailImage.width || this.wormTailImage.naturalWidth || 30;
        const imgHeight = this.wormTailImage.height || this.wormTailImage.naturalHeight || 30;
        ctx.drawImage(this.wormTailImage, -imgWidth / 2, -imgHeight / 2, imgWidth, imgHeight);
        
        // 根据蠕虫颜色给图片上色
        if (worm.color) {
          try {
            ctx.globalCompositeOperation = 'color';
          } catch (e) {
            ctx.globalCompositeOperation = 'multiply';
          }
          ctx.fillStyle = worm.color;
          ctx.fillRect(-imgWidth / 2, -imgHeight / 2, imgWidth, imgHeight);
          ctx.globalCompositeOperation = 'source-over';
        }
        
        ctx.restore();
      }
      
      // 再绘制身体段（从后往前：身N、身N-1、...、身2、身1）
      for (let i = segments.length - 2; i >= 1; i--) {
        const segment = segments[i];
        const screenPos = this.worldToScreen(segment.x, segment.y);
        
        ctx.save();
        ctx.translate(screenPos.x, screenPos.y);
        
        // 计算身体段的朝向（从当前段指向前一个段，即更靠近头部的段）
        let bodyDirection = null;
        if (i > 0) {
          const prevSegment = segments[i - 1]; // 前一个段（更靠近头部）
          const dx = prevSegment.x - segment.x;
          const dy = prevSegment.y - segment.y;
          
          // 计算方向
          if (dx > 0) {
            bodyDirection = 'right';
          } else if (dx < 0) {
            bodyDirection = 'left';
          } else if (dy > 0) {
            bodyDirection = 'down';
          } else if (dy < 0) {
            bodyDirection = 'up';
          }
        }
        
        // 计算身体段旋转角度
        let rotation = 0;
        if (bodyDirection) {
          rotation = this.getDirectionAngle(bodyDirection);
        } else {
          // 如果没有方向，使用头部方向作为默认值
          rotation = this.getDirectionAngle(worm.direction);
        }
        
        if (rotation !== 0) {
          ctx.rotate(rotation);
        }
        
        const imgWidth = this.wormBodyImage.width || this.wormBodyImage.naturalWidth || 30;
        const imgHeight = this.wormBodyImage.height || this.wormBodyImage.naturalHeight || 30;
        ctx.drawImage(this.wormBodyImage, -imgWidth / 2, -imgHeight / 2, imgWidth, imgHeight);
        
        // 根据蠕虫颜色给图片上色
        if (worm.color) {
          try {
            ctx.globalCompositeOperation = 'color';
          } catch (e) {
            ctx.globalCompositeOperation = 'multiply';
          }
          ctx.fillStyle = worm.color;
          ctx.fillRect(-imgWidth / 2, -imgHeight / 2, imgWidth, imgHeight);
          ctx.globalCompositeOperation = 'source-over';
        }
        
        ctx.restore();
      }
      
      // 最后绘制头部（最上层）
      if (segments.length > 0) {
        const headSegment = segments[0];
        const screenPos = this.worldToScreen(headSegment.x, headSegment.y);
        
        ctx.save();
        ctx.translate(screenPos.x, screenPos.y);
        
        // 头部根据方向旋转
        const rotation = this.getDirectionAngle(worm.direction);
        if (rotation !== 0) {
          ctx.rotate(rotation);
        }
        
        const imgWidth = this.wormHeadImage.width || this.wormHeadImage.naturalWidth || 30;
        const imgHeight = this.wormHeadImage.height || this.wormHeadImage.naturalHeight || 30;
        ctx.drawImage(this.wormHeadImage, -imgWidth / 2, -imgHeight / 2, imgWidth, imgHeight);
        
        // 根据蠕虫颜色给图片上色
        if (worm.color) {
          try {
            ctx.globalCompositeOperation = 'color';
          } catch (e) {
            ctx.globalCompositeOperation = 'multiply';
          }
          ctx.fillStyle = worm.color;
          ctx.fillRect(-imgWidth / 2, -imgHeight / 2, imgWidth, imgHeight);
          ctx.globalCompositeOperation = 'source-over';
        }
        
        ctx.restore();
      }
    } else {
      // 图片未加载，使用圆形绘制作为降级方案
      const segmentRadius = this.cellSize * 0.4;
      for (let i = 0; i < segments.length; i++) {
        const segment = segments[i];
        const screenPos = this.worldToScreen(segment.x, segment.y);
        const isHead = i === 0;

        // 身体段颜色
        ctx.fillStyle = worm.color;
        ctx.beginPath();
        ctx.arc(screenPos.x, screenPos.y, segmentRadius, 0, Math.PI * 2);
        ctx.fill();

        // 头部眼睛（根据方向调整眼睛位置）
        if (isHead) {
          ctx.fillStyle = '#FFFFFF';
          const eyeSize = segmentRadius * 0.35;
          const eyeOffset = segmentRadius * 0.35;
          
          // 根据蠕虫朝向调整眼睛位置
          let eyeX1, eyeY1, eyeX2, eyeY2;
          const dir = worm.direction;
          
          if (dir === 'left') {
            eyeX1 = screenPos.x - eyeOffset;
            eyeY1 = screenPos.y - eyeOffset;
            eyeX2 = screenPos.x - eyeOffset;
            eyeY2 = screenPos.y + eyeOffset;
          } else if (dir === 'right') {
            eyeX1 = screenPos.x + eyeOffset;
            eyeY1 = screenPos.y - eyeOffset;
            eyeX2 = screenPos.x + eyeOffset;
            eyeY2 = screenPos.y + eyeOffset;
          } else if (dir === 'up') {
            eyeX1 = screenPos.x - eyeOffset;
            eyeY1 = screenPos.y - eyeOffset;
            eyeX2 = screenPos.x + eyeOffset;
            eyeY2 = screenPos.y - eyeOffset;
          } else { // down
            eyeX1 = screenPos.x - eyeOffset;
            eyeY1 = screenPos.y + eyeOffset;
            eyeX2 = screenPos.x + eyeOffset;
            eyeY2 = screenPos.y + eyeOffset;
          }
          
          // 绘制白色眼睛背景
          ctx.beginPath();
          ctx.arc(eyeX1, eyeY1, eyeSize, 0, Math.PI * 2);
          ctx.fill();
          ctx.beginPath();
          ctx.arc(eyeX2, eyeY2, eyeSize, 0, Math.PI * 2);
          ctx.fill();
          
          // 绘制黑色眼珠
          ctx.fillStyle = '#000000';
          const pupilSize = eyeSize * 0.5;
          ctx.beginPath();
          ctx.arc(eyeX1, eyeY1, pupilSize, 0, Math.PI * 2);
          ctx.fill();
          ctx.beginPath();
          ctx.arc(eyeX2, eyeY2, pupilSize, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }

    ctx.shadowBlur = 0;
  }

  /**
   * 渲染底部UI
   */
  renderBottomUI() {
    const ctx = this.ctx;
    const width = this.canvas.width;   // 1080
    const height = this.canvas.height; // 2340
    const bottomBarHeight = 100; // 底部栏高度

    // 背景
    ctx.fillStyle = '#E3F2FD';
    ctx.fillRect(0, height - bottomBarHeight, width, bottomBarHeight);
    
    // 顶部边框线
    ctx.strokeStyle = '#BBDEFB';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, height - bottomBarHeight);
    ctx.lineTo(width, height - bottomBarHeight);
    ctx.stroke();

    // 缩放滑块（适配设计分辨率）
    const sliderX = width / 2;
    const sliderY = height - bottomBarHeight / 2;
    const sliderWidth = 400;
    const sliderHeight = 8;
    const handleSize = 40;

    // 滑块轨道背景
    ctx.fillStyle = '#BBDEFB';
    ctx.fillRect(sliderX - sliderWidth / 2, sliderY - sliderHeight / 2, sliderWidth, sliderHeight);

    // 计算滑块手柄位置（根据当前zoom值）
    const zoomRange = this.maxZoom - this.minZoom;
    const zoomRatio = (this.zoom - this.minZoom) / zoomRange; // 0 到 1
    const handleX = sliderX - sliderWidth / 2 + zoomRatio * sliderWidth;

    // 绘制已填充部分（滑块左侧，黑色）
    if (zoomRatio > 0) {
      ctx.fillStyle = '#000000';
      ctx.fillRect(sliderX - sliderWidth / 2, sliderY - sliderHeight / 2, zoomRatio * sliderWidth, sliderHeight);
    }

    // 滑块手柄
    ctx.fillStyle = '#1976D2';
    ctx.beginPath();
    ctx.arc(handleX, sliderY, handleSize / 2, 0, Math.PI * 2);
    ctx.fill();
    
    // 手柄边框
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 2;
    ctx.stroke();

    // 减号按钮
    const minusX = sliderX - sliderWidth / 2 - 60;
    ctx.fillStyle = '#666666';
    ctx.font = 'bold 48px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('−', minusX, sliderY);

    // 加号按钮
    const plusX = sliderX + sliderWidth / 2 + 60;
    ctx.fillText('+', plusX, sliderY);
    
    // 重置textBaseline
    ctx.textBaseline = 'alphabetic';
  }

  /**
   * 渲染游戏结束遮罩（适配设计分辨率）
   */
  renderGameOverOverlay() {
    const ctx = this.ctx;
    const width = this.canvas.width;
    const height = this.canvas.height;

    // 半透明遮罩
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, 0, width, height);

    // 文字（适配设计分辨率）
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 96px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    const text = this.isVictory ? '胜利！' : '失败';
    ctx.fillText(text, width / 2, height / 2);
    
    // 提示文字
    ctx.font = '48px Arial';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.fillText('即将返回...', width / 2, height / 2 + 100);
    
    // 重置textBaseline
    ctx.textBaseline = 'alphabetic';
  }

  /**
   * 更新场景
   * @param {number} deltaTime - 距离上次更新的时间（毫秒）
   */
  update(deltaTime) {
    // 更新所有蠕虫的动画进度
    const currentTime = Date.now();
    for (const worm of this.worms) {
      if (worm.isAnimating) {
        worm.updateAnimation(currentTime);
      }
    }
  }
}

module.exports = GameScene;

