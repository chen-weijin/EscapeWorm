/**
 * 存储管理器
 * 管理本地数据存储
 */
class StorageManager {
  constructor() {
    this.storageKey = {
      UNLOCKED_LEVELS: 'unlockedLevels',
      COMPLETED_LEVELS: 'completedLevels',
      CURRENT_LEVEL: 'currentLevel',
      SETTINGS: 'settings'
    };
  }

  /**
   * 初始化存储
   */
  init() {
    // 确保第一关默认解锁
    const unlocked = this.getUnlockedLevels();
    if (unlocked.length === 0) {
      this.setUnlockedLevels([1]);
    }
  }

  /**
   * 获取已解锁关卡列表
   * @returns {Array<number>}
   */
  getUnlockedLevels() {
    try {
      const data = wx.getStorageSync(this.storageKey.UNLOCKED_LEVELS);
      return data || [];
    } catch (e) {
      console.error('读取解锁关卡失败:', e);
      return [1]; // 默认第一关解锁
    }
  }

  /**
   * 设置已解锁关卡列表
   * @param {Array<number>} levels
   */
  setUnlockedLevels(levels) {
    try {
      wx.setStorageSync(this.storageKey.UNLOCKED_LEVELS, levels);
    } catch (e) {
      console.error('保存解锁关卡失败:', e);
    }
  }

  /**
   * 解锁关卡
   * @param {number} levelId
   */
  unlockLevel(levelId) {
    const unlocked = this.getUnlockedLevels();
    if (!unlocked.includes(levelId)) {
      unlocked.push(levelId);
      this.setUnlockedLevels(unlocked);
    }
  }

  /**
   * 检查关卡是否已解锁
   * @param {number} levelId
   * @returns {boolean}
   */
  isLevelUnlocked(levelId) {
    return this.getUnlockedLevels().includes(levelId);
  }

  /**
   * 获取已完成关卡列表
   * @returns {Array<number>}
   */
  getCompletedLevels() {
    try {
      const data = wx.getStorageSync(this.storageKey.COMPLETED_LEVELS);
      return data || [];
    } catch (e) {
      console.error('读取完成关卡失败:', e);
      return [];
    }
  }

  /**
   * 设置已完成关卡列表
   * @param {Array<number>} levels
   */
  setCompletedLevels(levels) {
    try {
      wx.setStorageSync(this.storageKey.COMPLETED_LEVELS, levels);
    } catch (e) {
      console.error('保存完成关卡失败:', e);
    }
  }

  /**
   * 标记关卡为已完成
   * @param {number} levelId
   */
  completeLevel(levelId) {
    const completed = this.getCompletedLevels();
    if (!completed.includes(levelId)) {
      completed.push(levelId);
      this.setCompletedLevels(completed);
    }

    // 自动解锁下一关
    this.unlockLevel(levelId + 1);
  }

  /**
   * 检查关卡是否已完成
   * @param {number} levelId
   * @returns {boolean}
   */
  isLevelCompleted(levelId) {
    return this.getCompletedLevels().includes(levelId);
  }

  /**
   * 获取当前关卡
   * @returns {number}
   */
  getCurrentLevel() {
    try {
      const data = wx.getStorageSync(this.storageKey.CURRENT_LEVEL);
      return data || 1;
    } catch (e) {
      return 1;
    }
  }

  /**
   * 设置当前关卡
   * @param {number} levelId
   */
  setCurrentLevel(levelId) {
    try {
      wx.setStorageSync(this.storageKey.CURRENT_LEVEL, levelId);
    } catch (e) {
      console.error('保存当前关卡失败:', e);
    }
  }

  /**
   * 获取游戏设置
   * @returns {Object}
   */
  getSettings() {
    try {
      const data = wx.getStorageSync(this.storageKey.SETTINGS);
      return data || {
        musicEnabled: true,
        soundEnabled: true
      };
    } catch (e) {
      return {
        musicEnabled: true,
        soundEnabled: true
      };
    }
  }

  /**
   * 保存游戏设置
   * @param {Object} settings
   */
  setSettings(settings) {
    try {
      wx.setStorageSync(this.storageKey.SETTINGS, settings);
    } catch (e) {
      console.error('保存设置失败:', e);
    }
  }
}

module.exports = StorageManager;

