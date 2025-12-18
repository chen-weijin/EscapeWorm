/**
 * 路径查找工具类
 * 使用BFS算法查找蠕虫从当前位置到边界的逃脱路径
 */
class PathFinder {
  /**
   * 查找从蠕虫当前位置到边界的路径
   * 蠕虫只能沿着头部方向向前移动，不能拐弯
   * @param {Object} worm - 蠕虫对象
   * @param {Object} matrix - 矩阵配置 {width, height}
   * @param {Array} obstacles - 障碍物位置数组 [{x, y}, ...]
   * @param {Array} escapePoints - 逃脱点数组 [{x, y}, ...]
   * @returns {Array|null} 路径数组，如果找不到路径返回null
   */
  static findPath(worm, matrix, obstacles, escapePoints) {
    const headPos = worm.getHeadPosition();
    const direction = this.getDirectionVector(worm.direction);
    const wormLength = worm.getLength();
    
    // 蠕虫只能沿着当前方向前进，不能拐弯
    // 检查从当前位置沿着当前方向是否能到达边界
    let currentX = headPos.x;
    let currentY = headPos.y;
    const path = [];
    let reachedBoundary = false;

    while (true) {
      const nextX = currentX + direction.x;
      const nextY = currentY + direction.y;
      
      // 检查是否超出边界（可以逃脱）
      if (nextX < 0 || nextX >= matrix.width || nextY < 0 || nextY >= matrix.height) {
        // 可以逃脱，添加到路径
        path.push({ x: nextX, y: nextY });
        reachedBoundary = true;
        
        // 继续添加额外的步数，让整个蠕虫都能离开屏幕
        // 需要添加 wormLength - 1 步
        for (let i = 1; i < wormLength; i++) {
          const extraX = nextX + direction.x * i;
          const extraY = nextY + direction.y * i;
          path.push({ x: extraX, y: extraY });
        }
        
        return { canEscape: true, path: path };
      }

      // 检查是否是障碍物
      const isObstacle = obstacles.some(obs => obs.x === nextX && obs.y === nextY);
      if (isObstacle) {
        // 遇到障碍物，无法逃脱，返回到障碍物前一步的路径
        // 返回 { canEscape: false, pathToObstacle: path } 格式
        return { canEscape: false, pathToObstacle: path };
      }

      // 检查是否到达逃脱点
      for (const escapePoint of escapePoints) {
        if (nextX === escapePoint.x && nextY === escapePoint.y) {
          path.push({ x: nextX, y: nextY });
          return { canEscape: true, path: path };
        }
      }

      // 继续前进
      path.push({ x: nextX, y: nextY });
      currentX = nextX;
      currentY = nextY;

      // 防止无限循环（理论上不应该发生）
      if (path.length > matrix.width * matrix.height) {
        return { canEscape: false, pathToObstacle: [] };
      }
    }
  }

  /**
   * 判断蠕虫是否可以逃脱
   * @param {Object} worm - 蠕虫对象
   * @param {Object} matrix - 矩阵配置
   * @param {Array} obstacles - 障碍物位置数组
   * @param {Array} escapePoints - 逃脱点数组
   * @returns {boolean} 是否可以逃脱
   */
  static canEscape(worm, matrix, obstacles, escapePoints) {
    const path = this.findPath(worm, matrix, obstacles, escapePoints);
    return path !== null && path.length > 0;
  }

  /**
   * 获取蠕虫朝向对应的方向向量
   * @param {string} direction - 方向字符串 (up/down/left/right)
   * @returns {Object} 方向向量 {x, y}
   */
  static getDirectionVector(direction) {
    const dirMap = {
      'up': { x: 0, y: -1 },
      'down': { x: 0, y: 1 },
      'left': { x: -1, y: 0 },
      'right': { x: 1, y: 0 }
    };
    return dirMap[direction] || { x: 0, y: 0 };
  }
}

module.exports = PathFinder;

