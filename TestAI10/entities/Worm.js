/**
 * 蠕虫实体类
 */
const PathFinder = require('../utils/PathFinder');

class Worm {
  /**
   * 构造函数
   * @param {Object} config - 蠕虫配置
   * @param {number} config.id - 蠕虫ID
   * @param {Array} config.segments - 身体段坐标数组 [{x, y}, ...]
   * @param {string} config.direction - 朝向 (up/down/left/right)
   * @param {string} config.color - 颜色
   */
  constructor(config) {
    this.id = config.id;
    this.originalSegments = JSON.parse(JSON.stringify(config.segments)); // 深拷贝原始位置
    this.segments = JSON.parse(JSON.stringify(config.segments)); // 当前位置
    this.color = config.color;
    this.isEscaped = false;
    this.isHighlighted = false; // 是否高亮（碰撞警示）
    
    // 动画相关
    this.previousSegments = JSON.parse(JSON.stringify(config.segments)); // 动画起始位置
    this.animationProgress = 1.0; // 动画进度 0-1
    this.isAnimating = false; // 是否正在动画
    this.animationDuration = 200; // 动画持续时间（毫秒）
    this.animationStartTime = 0; // 动画开始时间
    
    // 根据segments的实际顺序自动判断direction
    // segments[0]是头部，segments[1]是第一个身体段
    // 从segments[0]到segments[1]的方向是身体的方向
    // 但蠕虫的朝向（direction）应该是头部的朝向，即与身体方向相反
    if (this.segments.length >= 2) {
      const first = this.segments[0];  // 头部
      const second = this.segments[1]; // 第一个身体段
      const dx = second.x - first.x;
      const dy = second.y - first.y;
      
      // 根据segments的实际方向判断身体方向
      let bodyDirection = null;
      if (dx > 0) {
        bodyDirection = 'right';
      } else if (dx < 0) {
        bodyDirection = 'left';
      } else if (dy > 0) {
        bodyDirection = 'down';
      } else if (dy < 0) {
        bodyDirection = 'up';
      }
      
      // 蠕虫的朝向（direction）应该是头部的朝向，即与身体方向相反
      const oppositeDirection = {
        'right': 'left',
        'left': 'right',
        'up': 'down',
        'down': 'up'
      };
      
      this.direction = oppositeDirection[bodyDirection] || config.direction;
      
      // 如果自动计算的方向与配置不一致，输出警告
      if (this.direction !== config.direction) {
        console.log(`蠕虫 ${this.id} 根据segments自动计算方向: ${this.direction} (配置为: ${config.direction})`);
      }
    } else {
      this.direction = config.direction;
    }
  }

  /**
   * 获取头部位置
   * 根据需求文档：segments数组第一个元素为头部（带眼睛），最后一个元素为尾部
   * @returns {Object} 头部位置 {x, y}
   */
  getHeadPosition() {
    // segments[0]是头部（带眼睛），直接返回
    return this.segments[0];
  }

  /**
   * 获取身体段位置（不包括头部）
   * @returns {Array} 身体段位置数组 [{x, y}, ...]
   */
  getBodySegments() {
    // segments[0]是头部，返回除了第一个元素的所有段
    return this.segments.slice(1);
  }

  /**
   * 获取所有段位置（包括头部）
   * @returns {Array} 所有段位置数组
   */
  getAllSegments() {
    return this.segments;
  }

  /**
   * 获取插值后的段位置（用于平滑渲染）
   * @param {number} progress - 动画进度 0-1，如果未提供则使用当前动画进度
   * @returns {Array} 插值后的段位置数组
   */
  getInterpolatedSegments(progress = null) {
    if (progress === null) {
      progress = this.animationProgress;
    }
    
    // 如果动画已完成或未开始，直接返回当前位置
    if (progress >= 1.0 || !this.isAnimating) {
      return this.segments;
    }
    
    // 使用缓动函数让移动更自然（ease-out）
    const easedProgress = 1 - Math.pow(1 - progress, 3);
    
    // 插值每个段的位置
    const interpolated = [];
    for (let i = 0; i < this.segments.length; i++) {
      const prevSeg = this.previousSegments[i] || this.segments[i];
      const currSeg = this.segments[i];
      
      interpolated.push({
        x: prevSeg.x + (currSeg.x - prevSeg.x) * easedProgress,
        y: prevSeg.y + (currSeg.y - prevSeg.y) * easedProgress
      });
    }
    
    return interpolated;
  }

  /**
   * 开始移动动画
   * @param {Object} newHeadPosition - 新的头部位置 {x, y}
   * @param {number} duration - 动画持续时间（毫秒），默认200ms
   */
  startMoveAnimation(newHeadPosition, duration = 200) {
    if (this.isEscaped) {
      return;
    }

    // 保存当前位置作为动画起始位置
    this.previousSegments = JSON.parse(JSON.stringify(this.segments));
    
    // segments[0]是头部，直接更新
    // 新头部在开头
    const newSegments = [newHeadPosition];
    
    // 身体段跟随：每个段移动到前一个段的位置
    // segments[1]移动到原segments[0]的位置，segments[2]移动到原segments[1]的位置...
    for (let i = 0; i < this.segments.length - 1; i++) {
      newSegments.push({ 
        x: this.segments[i].x, 
        y: this.segments[i].y 
      });
    }

    this.segments = newSegments;
    
    // 开始动画
    this.animationProgress = 0;
    this.isAnimating = true;
    this.animationDuration = duration;
    this.animationStartTime = Date.now();
  }

  /**
   * 更新动画进度
   * @param {number} currentTime - 当前时间（毫秒）
   * @returns {boolean} 动画是否已完成
   */
  updateAnimation(currentTime) {
    if (!this.isAnimating) {
      return true;
    }
    
    const elapsed = currentTime - this.animationStartTime;
    this.animationProgress = Math.min(elapsed / this.animationDuration, 1.0);
    
    if (this.animationProgress >= 1.0) {
      this.isAnimating = false;
      return true;
    }
    
    return false;
  }

  /**
   * 立即完成动画
   */
  completeAnimation() {
    this.animationProgress = 1.0;
    this.isAnimating = false;
    this.previousSegments = JSON.parse(JSON.stringify(this.segments));
  }

  /**
   * 移动蠕虫到新位置（立即移动，不使用动画）
   * 蠕虫移动时，身体段跟随头部移动
   * 每个身体段移动到前一个段的位置（向头部方向移动）
   * @param {Object} newHeadPosition - 新的头部位置 {x, y}
   */
  moveTo(newHeadPosition) {
    if (this.isEscaped) {
      return;
    }

    // segments[0]是头部，直接更新
    // 新头部在开头
    const newSegments = [newHeadPosition];
    
    // 身体段跟随：每个段移动到前一个段的位置
    // segments[1]移动到原segments[0]的位置，segments[2]移动到原segments[1]的位置...
    for (let i = 0; i < this.segments.length - 1; i++) {
      newSegments.push({ 
        x: this.segments[i].x, 
        y: this.segments[i].y 
      });
    }

    this.segments = newSegments;
    // 更新previousSegments以保持一致性
    this.previousSegments = JSON.parse(JSON.stringify(this.segments));
    this.isAnimating = false;
    this.animationProgress = 1.0;
  }

  /**
   * 复位到原始位置
   */
  reset() {
    this.segments = JSON.parse(JSON.stringify(this.originalSegments));
    this.previousSegments = JSON.parse(JSON.stringify(this.originalSegments));
    this.isEscaped = false;
    this.isHighlighted = false;
    this.isAnimating = false;
    this.animationProgress = 1.0;
  }

  /**
   * 设置高亮状态
   * @param {boolean} highlighted - 是否高亮
   */
  setHighlighted(highlighted) {
    this.isHighlighted = highlighted;
  }

  /**
   * 标记为已逃脱
   */
  markEscaped() {
    this.isEscaped = true;
  }

  /**
   * 检查蠕虫是否已逃脱
   * @returns {boolean}
   */
  hasEscaped() {
    return this.isEscaped;
  }

  /**
   * 获取蠕虫长度
   * @returns {number}
   */
  getLength() {
    return this.segments.length;
  }

  /**
   * 获取蠕虫配置（用于保存）
   * @returns {Object}
   */
  getConfig() {
    return {
      id: this.id,
      segments: JSON.parse(JSON.stringify(this.segments)),
      direction: this.direction,
      color: this.color
    };
  }
}

module.exports = Worm;

