/**
 * 关卡管理器
 */
class LevelManager {
  constructor() {
    this.currentLevel = null;
    this.currentLevelData = null;
    // 微信小游戏文件路径（相对于项目根目录）
    this.levelsPath = 'config/levels/';
  }

  /**
   * 加载关卡配置
   * @param {number} levelId - 关卡ID
   * @returns {Promise<Object>} 关卡数据
   */
  async loadLevel(levelId) {
    return new Promise((resolve, reject) => {
      const filePath = `${this.levelsPath}level${levelId}.json`;
      
      // 微信小游戏文件读取 - 使用文件系统管理器
      const fs = wx.getFileSystemManager();
      
      fs.readFile({
        filePath: filePath,
        encoding: 'utf8',
        success: (res) => {
          try {
            const levelData = JSON.parse(res.data);
            
            // 验证关卡数据
            if (this.validateLevelData(levelData)) {
              this.currentLevel = levelId;
              this.currentLevelData = levelData;
              resolve(levelData);
            } else {
              console.error('关卡数据验证失败:', levelId);
              reject(new Error('关卡数据验证失败'));
            }
          } catch (e) {
            console.error('关卡数据解析失败:', e);
            reject(new Error('关卡数据解析失败: ' + e.message));
          }
        },
        fail: (err) => {
          console.error('加载关卡失败:', err);
          reject(new Error('加载关卡失败: ' + (err.errMsg || JSON.stringify(err))));
        }
      });
    });
  }

  /**
   * 验证关卡数据
   * @param {Object} levelData - 关卡数据
   * @returns {boolean} 是否有效
   */
  validateLevelData(levelData) {
    if (!levelData.levelId || !levelData.matrix || !levelData.worms || !levelData.escapePoints) {
      return false;
    }

    if (!levelData.matrix.width || !levelData.matrix.height) {
      return false;
    }

    if (!Array.isArray(levelData.worms) || levelData.worms.length === 0) {
      return false;
    }

    if (!Array.isArray(levelData.escapePoints) || levelData.escapePoints.length === 0) {
      return false;
    }

    // 验证蠕虫数据
    for (const worm of levelData.worms) {
      if (!worm.id || !worm.segments || !worm.direction || !worm.color) {
        return false;
      }
      if (!Array.isArray(worm.segments) || worm.segments.length < 2) {
        return false;
      }
      // 验证坐标范围
      for (const segment of worm.segments) {
        if (segment.x < 0 || segment.x >= levelData.matrix.width ||
            segment.y < 0 || segment.y >= levelData.matrix.height) {
          return false;
        }
      }
    }

    return true;
  }

  /**
   * 获取当前关卡数据
   * @returns {Object|null}
   */
  getCurrentLevelData() {
    return this.currentLevelData;
  }

  /**
   * 获取当前关卡ID
   * @returns {number|null}
   */
  getCurrentLevelId() {
    return this.currentLevel;
  }

  /**
   * 获取关卡总数（需要根据实际文件数量）
   * @returns {number}
   */
  getTotalLevels() {
    // 这里可以根据实际情况返回，或者从配置中读取
    return 3; // 默认3关
  }
}

module.exports = LevelManager;

