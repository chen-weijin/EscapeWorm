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
    
    // 渲染相关
    this.cellSize = 30;
    this.offsetX = 0;
    this.offsetY = 0;
    this.zoom = 1.0;
    
    // 移动动画（支持多条蠕虫同时移动，不再使用全局状态）
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

    try {
      // 加载关卡数据
      const levelData = await this.levelManager.loadLevel(levelId);
      this.matrix = levelData.matrix;
      this.escapePoints = levelData.escapePoints;

      // 创建蠕虫对象
      for (const wormConfig of levelData.worms) {
        const worm = new Worm(wormConfig);
        this.worms.push(worm);
      }

      // 计算渲染参数
      this.calculateRenderParams();
    } catch (error) {
      console.error('初始化游戏场景失败:', error);
      this.matrix = null;
      throw error; // 重新抛出错误，让上层处理
    }
  }

  /**
   * 计算渲染参数
   */
  calculateRenderParams() {
    const canvasWidth = this.canvas.width;
    const canvasHeight = this.canvas.height;
    const gameAreaHeight = canvasHeight - 120; // 减去UI高度
    
    // 计算合适的格子大小
    const maxCellSizeX = (canvasWidth - 40) / this.matrix.width;
    const maxCellSizeY = (gameAreaHeight - 40) / this.matrix.height;
    this.cellSize = Math.min(maxCellSizeX, maxCellSizeY) * this.zoom;
    
    // 计算偏移量（居中）
    const totalWidth = this.matrix.width * this.cellSize;
    const totalHeight = this.matrix.height * this.cellSize;
    this.offsetX = (canvasWidth - totalWidth) / 2;
    this.offsetY = 80 + (gameAreaHeight - totalHeight) / 2;
  }

  /**
   * 世界坐标转屏幕坐标
   * @param {number} x - 世界X坐标
   * @param {number} y - 世界Y坐标
   * @returns {Object} 屏幕坐标 {x, y}
   */
  worldToScreen(x, y) {
    return {
      x: this.offsetX + x * this.cellSize,
      y: this.offsetY + y * this.cellSize
    };
  }

  /**
   * 屏幕坐标转世界坐标
   * @param {number} x - 屏幕X坐标
   * @param {number} y - 屏幕Y坐标
   * @returns {Object} 世界坐标 {x, y}
   */
  screenToWorld(x, y) {
    return {
      x: Math.floor((x - this.offsetX) / this.cellSize),
      y: Math.floor((y - this.offsetY) / this.cellSize)
    };
  }

  /**
   * 处理点击事件
   * @param {number} x - 点击X坐标
   * @param {number} y - 点击Y坐标
   */
  handleClick(x, y) {
    if (this.isGameOver || this.isVictory) {
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
   * 检查是否点击了UI按钮
   * @param {number} x - 屏幕X坐标
   * @param {number} y - 屏幕Y坐标
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
   * @param {number} screenX - 屏幕X坐标
   * @param {number} screenY - 屏幕Y坐标
   * @returns {Worm|null}
   */
  findWormAtScreenPosition(screenX, screenY) {
    const segmentRadius = this.cellSize * 0.4;
    const clickRadius = segmentRadius * 1.5; // 扩大点击范围，提高点击成功率
    
    for (const worm of this.worms) {
      if (worm.hasEscaped()) continue;

      const segments = worm.getAllSegments();
      for (const segment of segments) {
        const screenPos = this.worldToScreen(segment.x, segment.y);
        const distance = Math.sqrt(
          Math.pow(screenX - screenPos.x, 2) + 
          Math.pow(screenY - screenPos.y, 2)
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

    // 逐步移动（使用平滑动画）
    const moveDuration = 200; // 每步移动时间
    for (let i = 0; i < path.length; i++) {
      const nextPos = path[i];
      console.log(`移动步骤 ${i}:`, {
        from: worm.getHeadPosition(),
        to: nextPos,
        segmentsBefore: JSON.parse(JSON.stringify(worm.getAllSegments()))
      });
      
      // 开始移动动画
      worm.startMoveAnimation(nextPos, moveDuration);
      this.audioManager.playSound('move');
      
      // 等待动画完成
      await this.wait(moveDuration + 20); // 稍微多等一点确保动画完成
      
      // 确保动画已完成
      worm.completeAnimation();
      
      console.log(`移动步骤 ${i} 后:`, {
        headPos: worm.getHeadPosition(),
        segmentsAfter: JSON.parse(JSON.stringify(worm.getAllSegments()))
      });
    }

    // 蠕虫逃脱
    worm.markEscaped();
    this.audioManager.playSound('escape');
    this.effectManager.createEscapeEffect(
      this.worldToScreen(worm.getHeadPosition().x, worm.getHeadPosition().y),
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
    
    const moveDuration = 150; // 移动动画时间
    if (pathToObstacle.length === 0) {
      // 直接移动一步到阻挡位
      const nextPos = {
        x: headPos.x + direction.x,
        y: headPos.y + direction.y
      };
      worm.startMoveAnimation(nextPos, moveDuration);
      await this.wait(moveDuration + 20);
      worm.completeAnimation();
    } else {
      // 沿着路径移动到阻挡位置（最后一步+再前进一步到障碍物）
      for (let i = 0; i < pathToObstacle.length; i++) {
        const nextPos = pathToObstacle[i];
        worm.startMoveAnimation(nextPos, moveDuration);
        await this.wait(moveDuration + 20);
        worm.completeAnimation();
      }
      // 再移动一步到阻挡位置
      const lastPos = pathToObstacle[pathToObstacle.length - 1];
      const obstaclePos = {
        x: lastPos.x + direction.x,
        y: lastPos.y + direction.y
      };
      worm.startMoveAnimation(obstaclePos, moveDuration);
      await this.wait(moveDuration + 20);
      worm.completeAnimation();
    }
    
    this.audioManager.playSound('collision');
    
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
      await this.wait(moveDuration + 20);
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
      // 超出边界，直接逃脱（这种情况理论上不应该发生，因为已经判定为不可逃脱）
      worm.moveTo(nextPos);
      worm.markEscaped();
      this.audioManager.playSound('escape');
      this.effectManager.createEscapeEffect(
        this.worldToScreen(nextPos.x, nextPos.y),
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
      const moveDuration = 150;
      worm.startMoveAnimation(nextPos, moveDuration);
      this.audioManager.playSound('collision');
      await this.wait(moveDuration + 20);
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
      await this.wait(moveDuration + 20);
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
      const moveDuration = 200;
      worm.startMoveAnimation(nextPos, moveDuration);
      this.audioManager.playSound('move');
      await this.wait(moveDuration + 20);
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
      // 跳过正在移动的蠕虫（移动中的蠕虫不参与碰撞检测）
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
   * 设置缩放
   * @param {number} zoom - 缩放比例
   */
  setZoom(zoom) {
    this.zoom = Math.max(0.5, Math.min(2.0, zoom));
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
   * 渲染顶部UI
   */
  renderTopUI() {
    const ctx = this.ctx;
    const width = this.canvas.width;

    // 背景
    ctx.fillStyle = '#E3F2FD';
    ctx.fillRect(0, 0, width, 70);

    // 关卡名称
    ctx.fillStyle = '#1976D2';
    ctx.font = 'bold 24px Arial';
    ctx.textAlign = 'left';
    ctx.fillText(`关卡${this.currentLevelId}`, 20, 45);

    // 失败次数（红心）
    const heartSize = 20;
    const heartX = width / 2 - (this.failCount * heartSize) / 2;
    for (let i = 0; i < 3; i++) {
      const x = heartX + i * heartSize;
      const y = 25;
      ctx.fillStyle = i < this.failCount ? '#F44336' : '#CCCCCC';
      ctx.font = `${heartSize}px Arial`;
      ctx.fillText('♥', x, y + heartSize);
    }

    // 设置按钮
    ctx.fillStyle = '#666666';
    ctx.font = '20px Arial';
    ctx.textAlign = 'right';
    ctx.fillText('⚙', width - 20, 45);
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

    // 绘制网格
    ctx.strokeStyle = '#E0E0E0';
    ctx.lineWidth = 1;
    for (let x = 0; x <= this.matrix.width; x++) {
      const screenX = this.offsetX + x * this.cellSize;
      const startY = this.offsetY;
      const endY = this.offsetY + this.matrix.height * this.cellSize;
      ctx.beginPath();
      ctx.moveTo(screenX, startY);
      ctx.lineTo(screenX, endY);
      ctx.stroke();
    }
    for (let y = 0; y <= this.matrix.height; y++) {
      const screenY = this.offsetY + y * this.cellSize;
      const startX = this.offsetX;
      const endX = this.offsetX + this.matrix.width * this.cellSize;
      ctx.beginPath();
      ctx.moveTo(startX, screenY);
      ctx.lineTo(endX, screenY);
      ctx.stroke();
    }

    // 绘制逃脱点
    ctx.fillStyle = '#4CAF50';
    for (const point of this.escapePoints) {
      const screenPos = this.worldToScreen(point.x, point.y);
      ctx.beginPath();
      ctx.arc(screenPos.x, screenPos.y, this.cellSize * 0.3, 0, Math.PI * 2);
      ctx.fill();
    }

    // 绘制蠕虫
    for (const worm of this.worms) {
      if (worm.hasEscaped()) continue;
      this.renderWorm(worm);
    }
  }

  /**
   * 渲染蠕虫
   * @param {Worm} worm - 蠕虫对象
   */
  renderWorm(worm) {
    const ctx = this.ctx;
    // 使用插值后的段位置实现平滑移动
    const segments = worm.getInterpolatedSegments();
    const segmentRadius = this.cellSize * 0.4;

    // 高亮效果
    if (worm.isHighlighted) {
      ctx.shadowBlur = 10;
      ctx.shadowColor = '#F44336';
    } else {
      ctx.shadowBlur = 0;
    }

    // 先绘制身体连接线（让蠕虫看起来更连贯）
    if (segments.length > 1) {
      ctx.strokeStyle = worm.color;
      ctx.lineWidth = segmentRadius * 1.6;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.beginPath();
      
      const firstPos = this.worldToScreen(segments[0].x, segments[0].y);
      ctx.moveTo(firstPos.x, firstPos.y);
      
      for (let i = 1; i < segments.length; i++) {
        const pos = this.worldToScreen(segments[i].x, segments[i].y);
        ctx.lineTo(pos.x, pos.y);
      }
      ctx.stroke();
    }

    // 绘制身体段圆形
    // segments[0] 应该是头部，segments[segments.length-1] 是尾部
    for (let i = 0; i < segments.length; i++) {
      const segment = segments[i];
      const screenPos = this.worldToScreen(segment.x, segment.y);
      const isHead = i === 0; // 第一个元素是头部

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

    ctx.shadowBlur = 0;
  }

  /**
   * 渲染底部UI
   */
  renderBottomUI() {
    const ctx = this.ctx;
    const width = this.canvas.width;
    const height = this.canvas.height;

    // 背景
    ctx.fillStyle = '#E3F2FD';
    ctx.fillRect(0, height - 50, width, 50);

    // 缩放滑块
    const sliderX = width / 2;
    const sliderY = height - 25;
    const sliderWidth = 200;
    const sliderHeight = 4;
    const handleSize = 20;

    // 滑块轨道
    ctx.fillStyle = '#BBDEFB';
    ctx.fillRect(sliderX - sliderWidth / 2, sliderY - sliderHeight / 2, sliderWidth, sliderHeight);

    // 滑块手柄
    const handleX = sliderX - sliderWidth / 2 + (this.zoom - 0.5) / 1.5 * sliderWidth;
    ctx.fillStyle = '#1976D2';
    ctx.beginPath();
    ctx.arc(handleX, sliderY, handleSize / 2, 0, Math.PI * 2);
    ctx.fill();

    // 减号按钮
    ctx.fillStyle = '#666666';
    ctx.font = '24px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('−', sliderX - sliderWidth / 2 - 30, sliderY + 8);

    // 加号按钮
    ctx.fillText('+', sliderX + sliderWidth / 2 + 30, sliderY + 8);
  }

  /**
   * 渲染游戏结束遮罩
   */
  renderGameOverOverlay() {
    const ctx = this.ctx;
    const width = this.canvas.width;
    const height = this.canvas.height;

    // 半透明遮罩
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, 0, width, height);

    // 文字
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 48px Arial';
    ctx.textAlign = 'center';
    const text = this.isVictory ? '胜利！' : '失败';
    ctx.fillText(text, width / 2, height / 2);
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

