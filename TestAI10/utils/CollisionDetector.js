/**
 * 碰撞检测工具类
 */
const PathFinder = require('./PathFinder');

class CollisionDetector {
  /**
   * 检测蠕虫移动到新位置是否会碰撞
   * @param {Object} worm - 要移动的蠕虫
   * @param {Object} newPosition - 新位置 {x, y}
   * @param {Array} allWorms - 所有蠕虫数组
   * @returns {boolean} 是否碰撞
   */
  static checkCollision(worm, newPosition, allWorms) {
    // 遍历所有其他蠕虫
    for (const otherWorm of allWorms) {
      // 跳过自己
      if (otherWorm.id === worm.id) {
        continue;
      }

      // 跳过已逃脱的蠕虫
      if (otherWorm.hasEscaped()) {
        continue;
      }

      // 获取其他蠕虫的所有段（包括头部和身体段）
      const allSegments = otherWorm.getAllSegments();

      // 检查新位置是否与其他蠕虫的任何段重叠（包括头部）
      for (const segment of allSegments) {
        if (segment.x === newPosition.x && segment.y === newPosition.y) {
          return true; // 碰撞
        }
      }
    }

    return false; // 无碰撞
  }

  /**
   * 预测蠕虫下一步是否会碰撞
   * @param {Object} worm - 蠕虫对象
   * @param {Array} allWorms - 所有蠕虫数组
   * @returns {boolean} 是否会碰撞
   */
  static willCollide(worm, allWorms) {
    const headPos = worm.getHeadPosition();
    const direction = PathFinder.getDirectionVector(worm.direction);
    const nextPosition = {
      x: headPos.x + direction.x,
      y: headPos.y + direction.y
    };

    return this.checkCollision(worm, nextPosition, allWorms);
  }

  /**
   * 检查位置是否在矩阵范围内
   * @param {Object} position - 位置 {x, y}
   * @param {Object} matrix - 矩阵配置 {width, height}
   * @returns {boolean} 是否在范围内
   */
  static isInBounds(position, matrix) {
    return position.x >= 0 && position.x < matrix.width &&
           position.y >= 0 && position.y < matrix.height;
  }

  /**
   * 检查位置是否与其他蠕虫的任何部分重叠（包括头部）
   * @param {Object} position - 位置 {x, y}
   * @param {Array} allWorms - 所有蠕虫数组
   * @param {number} excludeWormId - 排除的蠕虫ID
   * @returns {boolean} 是否重叠
   */
  static isPositionOccupied(position, allWorms, excludeWormId = null) {
    for (const worm of allWorms) {
      if (excludeWormId !== null && worm.id === excludeWormId) {
        continue;
      }

      // 检查所有段（包括头部）
      const allSegments = worm.segments;
      for (const segment of allSegments) {
        if (segment.x === position.x && segment.y === position.y) {
          return true;
        }
      }
    }
    return false;
  }
}

module.exports = CollisionDetector;

