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
   * 初始化场景
   * @param {boolean} isVictory - 是否胜利
   * @param {number} levelId - 关卡ID
   */
  init(isVictory, levelId) {
    this.isVictory = isVictory;
    this.levelId = levelId;
    this.buttons = [];

    const width = this.canvas.width;
    const height = this.canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;

    if (isVictory) {
      // 胜利按钮：下一关、重玩、返回
      this.buttons = [
        {
          text: '下一关',
          x: centerX - 120,
          y: centerY + 100,
          width: 100,
          height: 50,
          action: 'next'
        },
        {
          text: '重玩',
          x: centerX,
          y: centerY + 100,
          width: 100,
          height: 50,
          action: 'replay'
        },
        {
          text: '返回',
          x: centerX + 120,
          y: centerY + 100,
          width: 100,
          height: 50,
          action: 'menu'
        }
      ];
    } else {
      // 失败按钮：重玩、返回
      this.buttons = [
        {
          text: '重玩',
          x: centerX - 60,
          y: centerY + 100,
          width: 100,
          height: 50,
          action: 'replay'
        },
        {
          text: '返回',
          x: centerX + 60,
          y: centerY + 100,
          width: 100,
          height: 50,
          action: 'menu'
        }
      ];
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
    ctx.fillStyle = this.isVictory ? '#E8F5E9' : '#FFEBEE';
    ctx.fillRect(0, 0, width, height);

    // 绘制结果文字
    ctx.fillStyle = this.isVictory ? '#4CAF50' : '#F44336';
    ctx.font = 'bold 64px Arial';
    ctx.textAlign = 'center';
    const resultText = this.isVictory ? '胜利！' : '失败';
    ctx.fillText(resultText, width / 2, height / 2 - 50);

    // 绘制关卡信息
    ctx.fillStyle = '#666666';
    ctx.font = '24px Arial';
    ctx.fillText(`关卡 ${this.levelId}`, width / 2, height / 2 + 20);

    // 绘制按钮
    for (const button of this.buttons) {
      this.renderButton(button);
    }
  }

  /**
   * 渲染按钮
   * @param {Object} button - 按钮配置
   */
  renderButton(button) {
    const ctx = this.ctx;

    // 按钮背景
    ctx.fillStyle = '#2196F3';
    ctx.fillRect(button.x - button.width / 2, button.y - button.height / 2, button.width, button.height);

    // 按钮文字
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '20px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(button.text, button.x, button.y + 7);
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

