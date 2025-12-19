System.register(["__unresolved_0", "cc", "__unresolved_1"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, sys, Logger, _dec, _class, _crd, ccclass, property, StorageManager;

  function _reportPossibleCrUseOfLogger(extras) {
    _reporterNs.report("Logger", "../utils/Logger", _context.meta, extras);
  }

  return {
    setters: [function (_unresolved_) {
      _reporterNs = _unresolved_;
    }, function (_cc) {
      _cclegacy = _cc.cclegacy;
      __checkObsolete__ = _cc.__checkObsolete__;
      __checkObsoleteInNamespace__ = _cc.__checkObsoleteInNamespace__;
      _decorator = _cc._decorator;
      Component = _cc.Component;
      sys = _cc.sys;
    }, function (_unresolved_2) {
      Logger = _unresolved_2.Logger;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "6b3e3OvowRJWITWcR6d9wx1", "StorageManager", undefined);
      /**
       * 存储管理器
       * 管理本地数据存储
       */


      __checkObsolete__(['_decorator', 'Component', 'sys']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("StorageManager", StorageManager = (_dec = ccclass('StorageManager'), _dec(_class = class StorageManager extends Component {
        constructor(...args) {
          super(...args);
          this.UNLOCKED_LEVELS = 'unlockedLevels';
          this.COMPLETED_LEVELS = 'completedLevels';
          this.CURRENT_LEVEL = 'currentLevel';
          this.SETTINGS = 'settings';
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
         */


        getUnlockedLevels() {
          try {
            const data = sys.localStorage.getItem(this.UNLOCKED_LEVELS);
            return data ? JSON.parse(data) : [];
          } catch (e) {
            (_crd && Logger === void 0 ? (_reportPossibleCrUseOfLogger({
              error: Error()
            }), Logger) : Logger).error('读取解锁关卡失败:', e);
            return [1];
          }
        }
        /**
         * 设置已解锁关卡列表
         */


        setUnlockedLevels(levels) {
          try {
            sys.localStorage.setItem(this.UNLOCKED_LEVELS, JSON.stringify(levels));
          } catch (e) {
            (_crd && Logger === void 0 ? (_reportPossibleCrUseOfLogger({
              error: Error()
            }), Logger) : Logger).error('保存解锁关卡失败:', e);
          }
        }
        /**
         * 解锁关卡
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
         */


        isLevelUnlocked(levelId) {
          return this.getUnlockedLevels().includes(levelId);
        }
        /**
         * 获取已完成关卡列表
         */


        getCompletedLevels() {
          try {
            const data = sys.localStorage.getItem(this.COMPLETED_LEVELS);
            return data ? JSON.parse(data) : [];
          } catch (e) {
            (_crd && Logger === void 0 ? (_reportPossibleCrUseOfLogger({
              error: Error()
            }), Logger) : Logger).error('读取完成关卡失败:', e);
            return [];
          }
        }
        /**
         * 设置已完成关卡列表
         */


        setCompletedLevels(levels) {
          try {
            sys.localStorage.setItem(this.COMPLETED_LEVELS, JSON.stringify(levels));
          } catch (e) {
            (_crd && Logger === void 0 ? (_reportPossibleCrUseOfLogger({
              error: Error()
            }), Logger) : Logger).error('保存完成关卡失败:', e);
          }
        }
        /**
         * 标记关卡为已完成
         */


        completeLevel(levelId) {
          const completed = this.getCompletedLevels();

          if (!completed.includes(levelId)) {
            completed.push(levelId);
            this.setCompletedLevels(completed);
          } // 自动解锁下一关


          this.unlockLevel(levelId + 1);
        }
        /**
         * 检查关卡是否已完成
         */


        isLevelCompleted(levelId) {
          return this.getCompletedLevels().includes(levelId);
        }
        /**
         * 获取当前关卡
         */


        getCurrentLevel() {
          try {
            const data = sys.localStorage.getItem(this.CURRENT_LEVEL);
            return data ? parseInt(data) : 1;
          } catch (e) {
            return 1;
          }
        }
        /**
         * 设置当前关卡
         */


        setCurrentLevel(levelId) {
          try {
            sys.localStorage.setItem(this.CURRENT_LEVEL, levelId.toString());
          } catch (e) {
            (_crd && Logger === void 0 ? (_reportPossibleCrUseOfLogger({
              error: Error()
            }), Logger) : Logger).error('保存当前关卡失败:', e);
          }
        }
        /**
         * 获取游戏设置
         */


        getSettings() {
          try {
            const data = sys.localStorage.getItem(this.SETTINGS);
            return data ? JSON.parse(data) : {
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
         */


        setSettings(settings) {
          try {
            sys.localStorage.setItem(this.SETTINGS, JSON.stringify(settings));
          } catch (e) {
            (_crd && Logger === void 0 ? (_reportPossibleCrUseOfLogger({
              error: Error()
            }), Logger) : Logger).error('保存设置失败:', e);
          }
        }

      }) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=cfc9b2176b96f8f0e1561b6bf52d18542dd0d054.js.map