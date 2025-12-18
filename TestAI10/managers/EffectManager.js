/**
 * 特效管理器
 * 管理粒子特效和动画效果
 */
class EffectManager {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.particles = []; // 粒子数组
    this.animations = []; // 动画数组
  }

  /**
   * 创建逃脱粒子特效
   * @param {Object} position - 位置 {x, y}
   * @param {string} color - 颜色
   */
  createEscapeEffect(position, color) {
    const particleCount = 20;
    for (let i = 0; i < particleCount; i++) {
      const angle = (Math.PI * 2 * i) / particleCount;
      const speed = 2 + Math.random() * 3;
      this.particles.push({
        x: position.x,
        y: position.y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        color: color,
        life: 1.0,
        decay: 0.02 + Math.random() * 0.02,
        size: 3 + Math.random() * 3
      });
    }
  }

  /**
   * 创建胜利粒子特效
   * @param {Object} center - 中心位置 {x, y}
   */
  createVictoryEffect(center) {
    const particleCount = 50;
    for (let i = 0; i < particleCount; i++) {
      const angle = (Math.PI * 2 * i) / particleCount;
      const speed = 3 + Math.random() * 4;
      const colors = ['#FFD700', '#FF6B6B', '#4ECDC4', '#95E1D3', '#F38181'];
      this.particles.push({
        x: center.x,
        y: center.y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        color: colors[Math.floor(Math.random() * colors.length)],
        life: 1.0,
        decay: 0.015 + Math.random() * 0.01,
        size: 4 + Math.random() * 4
      });
    }
  }

  /**
   * 创建高亮警示动画
   * @param {Object} worm - 蠕虫对象
   * @param {Function} callback - 动画完成回调
   */
  createHighlightAnimation(worm, callback) {
    let flashCount = 0;
    const maxFlashes = 6;
    const flashInterval = 100; // 毫秒

    const flash = () => {
      worm.setHighlighted(flashCount % 2 === 0);
      flashCount++;

      if (flashCount < maxFlashes) {
        setTimeout(flash, flashInterval);
      } else {
        worm.setHighlighted(false);
        if (callback) callback();
      }
    };

    flash();
  }

  /**
   * 更新所有粒子
   */
  updateParticles() {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const particle = this.particles[i];
      
      // 更新位置
      particle.x += particle.vx;
      particle.y += particle.vy;
      
      // 更新生命周期
      particle.life -= particle.decay;
      
      // 移除死亡粒子
      if (particle.life <= 0) {
        this.particles.splice(i, 1);
      }
    }
  }

  /**
   * 渲染所有粒子
   * @param {Function} worldToScreen - 世界坐标转屏幕坐标函数
   */
  renderParticles(worldToScreen) {
    this.ctx.save();
    for (const particle of this.particles) {
      const screenPos = worldToScreen(particle.x, particle.y);
      const alpha = particle.life;
      
      this.ctx.globalAlpha = alpha;
      this.ctx.fillStyle = particle.color;
      this.ctx.beginPath();
      this.ctx.arc(screenPos.x, screenPos.y, particle.size, 0, Math.PI * 2);
      this.ctx.fill();
    }
    this.ctx.restore();
  }

  /**
   * 更新（每帧调用）
   * @param {Function} worldToScreen - 世界坐标转屏幕坐标函数
   */
  update(worldToScreen) {
    this.updateParticles();
    this.renderParticles(worldToScreen);
  }

  /**
   * 清除所有特效
   */
  clear() {
    this.particles = [];
    this.animations = [];
  }
}

module.exports = EffectManager;

