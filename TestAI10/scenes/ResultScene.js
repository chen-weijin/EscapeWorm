/**
 * 结果展示场景
 */
class ResultScene {
  constructor(game) {
    this.game = game;
    this.canvas = game.canvas;
    this.ctx = game.ctx;
    this.isVictory = false;
    this.levelId = null;
    this.buttons = [];
  }

  /**
   * 初始化场景（适配设计分辨率1080x2340）
   * @param {boolean} isVictory - 是否胜利
   * @param {number} levelId - 关卡ID
   */
  init(isVictory, levelId) {
    this.isVictory = isVictory;
    this.levelId = levelId;
    this.buttons = [];

    const width = this.canvas.width;   // 1080
    const height = this.canvas.height; // 2340
    const centerX = width / 2;
    const centerY = height / 2;
    
    // 按钮尺寸（适配设计分辨率）
    const buttonWidth = 240;
    const buttonHeight = 100;
    const buttonSpacing = 280;

    if (isVictory) {
      // 胜利按钮：下一关、重玩、返回
      this.buttons = [
        {
          text: '下一关',
          x: centerX - buttonSpacing,
          y: centerY + 200,
          width: buttonWidth,
          height: buttonHeight,
          action: 'next'
        },
        {
          text: '重玩',
          x: centerX,
          y: centerY + 200,
          width: buttonWidth,
          height: buttonHeight,
          action: 'replay'
        },
        {
          text: '返回',
          x: centerX + buttonSpacing,
          y: centerY + 200,
          width: buttonWidth,
          height: buttonHeight,
          action: 'menu'
        }
      ];
    } else {
      // 失败按钮：重玩、返回
      this.buttons = [
        {
          text: '重玩',
          x: centerX - 150,
          y: centerY + 200,
          width: buttonWidth,
          height: buttonHeight,
          action: 'replay'
        },
        {
          text: '返回',
          x: centerX + 150,
          y: centerY + 200,
          width: buttonWidth,
          height: buttonHeight,
          action: 'menu'
        }
      ];
    }
  }

  /**
   * 渲染场景（适配设计分辨率1080x2340）
   */
  render() {
    const ctx = this.ctx;
    const width = this.canvas.width;   // 1080
    const height = this.canvas.height; // 2340

    // 清空画布
    ctx.clearRect(0, 0, width, height);

    // 绘制背景
    ctx.fillStyle = this.isVictory ? '#E8F5E9' : '#FFEBEE';
    ctx.fillRect(0, 0, width, height);

    // 绘制结果文字（适配设计分辨率）
    ctx.fillStyle = this.isVictory ? '#4CAF50' : '#F44336';
    ctx.font = 'bold 120px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    const resultText = this.isVictory ? '胜利！' : '失败';
    ctx.fillText(resultText, width / 2, height / 2 - 150);

    // 绘制关卡信息
    ctx.fillStyle = '#666666';
    ctx.font = '48px Arial';
    ctx.fillText(`关卡 ${this.levelId}`, width / 2, height / 2);

    // 绘制按钮
    for (const button of this.buttons) {
      this.renderButton(button);
    }
    
    // 重置textBaseline
    ctx.textBaseline = 'alphabetic';
  }

  /**
   * 渲染按钮（适配设计分辨率）
   * @param {Object} button - 按钮配置
   */
  renderButton(button) {
    const ctx = this.ctx;
    const cornerRadius = 16;

    // 按钮阴影
    ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
    this.roundRect(ctx, button.x - button.width / 2 + 4, button.y - button.height / 2 + 4, button.width, button.height, cornerRadius);
    ctx.fill();

    // 按钮背景（圆角矩形）
    ctx.fillStyle = '#2196F3';
    this.roundRect(ctx, button.x - button.width / 2, button.y - button.height / 2, button.width, button.height, cornerRadius);
    ctx.fill();
    
    // 按钮边框
    ctx.strokeStyle = '#1976D2';
    ctx.lineWidth = 3;
    ctx.stroke();

    // 按钮文字
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 40px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(button.text, button.x, button.y);
  }
  
  /**
   * 绘制圆角矩形
   */
  roundRect(ctx, x, y, width, height, radius) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
  }

  /**
   * 处理点击事件
   * @param {number} x - 点击X坐标
   * @param {number} y - 点击Y坐标
   */
  handleClick(x, y) {
    for (const button of this.buttons) {
      if (x >= button.x - button.width / 2 &&
          x <= button.x + button.width / 2 &&
          y >= button.y - button.height / 2 &&
          y <= button.y + button.height / 2) {
        this.handleButtonClick(button.action);
        break;
      }
    }
  }

  /**
   * 处理按钮点击
   * @param {string} action - 按钮动作
   */
  handleButtonClick(action) {
    this.game.audioManager.playSound('click');

    switch (action) {
      case 'next':
        const nextLevel = this.levelId + 1;
        if (this.game.storageManager.isLevelUnlocked(nextLevel)) {
          this.game.startLevel(nextLevel);
        } else {
          this.game.showMenu();
        }
        break;
      case 'replay':
        this.game.startLevel(this.levelId);
        break;
      case 'menu':
        this.game.showMenu();
        break;
    }
  }

  /**
   * 更新场景
   */
  update() {
    // 结果场景不需要更新逻辑
  }
}

module.exports = ResultScene;

