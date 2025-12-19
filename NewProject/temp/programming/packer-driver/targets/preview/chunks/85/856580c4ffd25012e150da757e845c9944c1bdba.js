System.register(["__unresolved_0", "cc", "__unresolved_1"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, resources, JsonAsset, Logger, _dec, _class, _crd, ccclass, property, LevelManager;

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
      resources = _cc.resources;
      JsonAsset = _cc.JsonAsset;
    }, function (_unresolved_2) {
      Logger = _unresolved_2.Logger;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "af403FeldVBFageRGio1dEY", "LevelManager", undefined);
      /**
       * 关卡管理器
       */


      __checkObsolete__(['_decorator', 'Component', 'resources', 'JsonAsset']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("LevelManager", LevelManager = (_dec = ccclass('LevelManager'), _dec(_class = class LevelManager extends Component {
        constructor() {
          super(...arguments);
          this.currentLevel = null;
          this.currentLevelData = null;
          this.levelsPath = 'levels/';
        }

        /**
         * 加载关卡配置
         */
        loadLevel(levelId) {
          return new Promise((resolve, reject) => {
            var filePath = this.levelsPath + "level" + levelId;
            resources.load(filePath, JsonAsset, (err, jsonAsset) => {
              if (err) {
                (_crd && Logger === void 0 ? (_reportPossibleCrUseOfLogger({
                  error: Error()
                }), Logger) : Logger).error('加载关卡失败:', err);
                reject(new Error('加载关卡失败: ' + err.message));
                return;
              }

              try {
                var levelData = jsonAsset.json;

                if (this.validateLevelData(levelData)) {
                  this.currentLevel = levelId;
                  this.currentLevelData = levelData;
                  resolve(levelData);
                } else {
                  (_crd && Logger === void 0 ? (_reportPossibleCrUseOfLogger({
                    error: Error()
                  }), Logger) : Logger).error('关卡数据验证失败:', levelId);
                  reject(new Error('关卡数据验证失败'));
                }
              } catch (e) {
                (_crd && Logger === void 0 ? (_reportPossibleCrUseOfLogger({
                  error: Error()
                }), Logger) : Logger).error('关卡数据解析失败:', e);
                reject(new Error('关卡数据解析失败'));
              }
            });
          });
        }
        /**
         * 验证关卡数据
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
          } // 验证蠕虫数据


          for (var worm of levelData.worms) {
            if (!worm.id || !worm.segments || !worm.direction || !worm.color) {
              return false;
            }

            if (!Array.isArray(worm.segments) || worm.segments.length < 2) {
              return false;
            } // 验证坐标范围


            for (var segment of worm.segments) {
              if (segment.x < 0 || segment.x >= levelData.matrix.width || segment.y < 0 || segment.y >= levelData.matrix.height) {
                return false;
              }
            }
          }

          return true;
        }
        /**
         * 获取当前关卡数据
         */


        getCurrentLevelData() {
          return this.currentLevelData;
        }
        /**
         * 获取当前关卡ID
         */


        getCurrentLevelId() {
          return this.currentLevel;
        }
        /**
         * 获取关卡总数
         */


        getTotalLevels() {
          return 3; // 默认3关
        }

      }) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=856580c4ffd25012e150da757e845c9944c1bdba.js.map