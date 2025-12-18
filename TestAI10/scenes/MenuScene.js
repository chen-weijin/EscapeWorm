/**
 * 关卡选择场景
 */
class MenuScene {
  constructor(game) {
    this.game = game;
    this.levelManager = game.levelManager;
    this.storageManager = game.storageManager;
    this.canvas = game.canvas;
    this.ctx = game.ctx;
    this.levels = [];
    this.selectedLevel = null;
  }

  /**
   * 初始化场景
   */
  async init() {
    const totalLevels = this.levelManager.getTotalLevels();
    this.levels = [];
    
    for (let i = 1; i <= totalLevels; i++) {
      const isUnlocked = this.storageManager.isLevelUnlocked(i);
      const isCompleted = this.storageManager.isLevelCompleted(i);
      this.levels.push({
        id: i,
        unlocked: isUnlocked,
        completed: isCompleted
      });
    }
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
    ctx.fillStyle = '#E8EAF6';
    ctx.fillRect(0, 0, width, height);

    // 绘制标题
    ctx.fillStyle = '#3F51B5';
    ctx.font = 'bold 48px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('蠕虫逃脱', width / 2, 80);

    // 绘制关卡网格
    const cols = 3;
    const rows = Math.ceil(this.levels.length / cols);
    const cellWidth = width / cols;
    const cellHeight = (height - 200) / rows;
    const cellSize = Math.min(cellWidth, cellHeight) * 0.8;
    const startX = (width - cols * cellSize) / 2;
    const startY = 150;

    for (let i = 0; i < this.levels.length; i++) {
      const level = this.levels[i];
      const row = Math.floor(i / cols);
      const col = i % cols;
      const x = startX + col * cellSize + cellSize / 2;
      const y = startY + row * cellSize + cellSize / 2;

      // 绘制关卡按钮
      if (level.unlocked) {
        ctx.fillStyle = level.completed ? '#4CAF50' : '#2196F3';
      } else {
        ctx.fillStyle = '#CCCCCC';
      }
      ctx.beginPath();
      ctx.arc(x, y, cellSize / 2 - 10, 0, Math.PI * 2);
      ctx.fill();

      // 绘制关卡编号
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 32px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(level.id, x, y + 10);

      // 绘制完成标记
      if (level.completed) {
        ctx.fillStyle = '#FFD700';
        ctx.font = '24px Arial';
        ctx.fillText('✓', x + cellSize / 3, y - cellSize / 3);
      }

      // 绘制锁定标记
      if (!level.unlocked) {
        ctx.fillStyle = '#666666';
        ctx.font = '24px Arial';
        ctx.fillText('🔒', x, y);
      }
    }
  }

  /**
   * 处理点击事件
   * @param {number} x - 点击X坐标
   * @param {number} y - 点击Y坐标
   */
  handleClick(x, y) {
    console.log('MenuScene handleClick:', { x, y, levelsCount: this.levels.length, canvasSize: { w: this.canvas.width, h: this.canvas.height } });
    
    if (!this.levels || this.levels.length === 0) {
      console.warn('关卡列表为空');
      return;
    }

    const cols = 3;
    const width = this.canvas.width;
    const height = this.canvas.height;
    const cellWidth = width / cols;
    const rows = Math.ceil(this.levels.length / cols);
    const cellHeight = (height - 200) / rows;
    const cellSize = Math.min(cellWidth, cellHeight) * 0.8;
    const startX = (width - cols * cellSize) / 2;
    const startY = 150;

    console.log('关卡布局信息:', { cols, rows, cellSize, startX, startY });

    for (let i = 0; i < this.levels.length; i++) {
      const level = this.levels[i];
      const row = Math.floor(i / cols);
      const col = i % cols;
      const levelX = startX + col * cellSize + cellSize / 2;
      const levelY = startY + row * cellSize + cellSize / 2;
      const distance = Math.sqrt((x - levelX) ** 2 + (y - levelY) ** 2);
      const radius = cellSize / 2 - 10;

      console.log(`关卡${level.id}:`, { 
        levelX, 
        levelY, 
        distance, 
        radius, 
        hit: distance < radius,
        unlocked: level.unlocked 
      });

      if (distance < radius) {
        console.log(`点击了关卡${level.id}`);
        if (level.unlocked) {
          console.log('关卡已解锁，开始加载...');
          this.game.audioManager.playSound('click');
          // 异步调用，捕获错误
          this.game.startLevel(level.id).catch(err => {
            console.error('启动关卡失败:', err);
            wx.showToast({
              title: '加载关卡失败',
              icon: 'none',
              duration: 2000
            });
          });
        } else {
          console.log('关卡未解锁');
          // 关卡未解锁提示
          wx.showToast({
            title: '关卡未解锁',
            icon: 'none',
            duration: 1500
          });
        }
        return; // 找到匹配的关卡后直接返回
      }
    }
    
    console.log('没有点击到任何关卡按钮');
  }

  /**
   * 更新场景
   */
  update() {
    // 菜单场景不需要更新逻辑
  }
}

module.exports = MenuScene;

