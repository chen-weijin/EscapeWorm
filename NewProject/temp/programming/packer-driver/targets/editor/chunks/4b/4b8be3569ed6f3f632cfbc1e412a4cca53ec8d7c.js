System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, Node, Label, Color, director, UITransform, Graphics, Input, StorageManager, AudioManager, _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _crd, ccclass, property, ResultController;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }

  function _reportPossibleCrUseOfStorageManager(extras) {
    _reporterNs.report("StorageManager", "../managers/StorageManager", _context.meta, extras);
  }

  function _reportPossibleCrUseOfAudioManager(extras) {
    _reporterNs.report("AudioManager", "../managers/AudioManager", _context.meta, extras);
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
      Node = _cc.Node;
      Label = _cc.Label;
      Color = _cc.Color;
      director = _cc.director;
      UITransform = _cc.UITransform;
      Graphics = _cc.Graphics;
      Input = _cc.Input;
    }, function (_unresolved_2) {
      StorageManager = _unresolved_2.StorageManager;
    }, function (_unresolved_3) {
      AudioManager = _unresolved_3.AudioManager;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "932ef43mJ5F6ojK2Nfg5rp3", "ResultController", undefined);
      /**
       * 结果场景控制器
       */


      __checkObsolete__(['_decorator', 'Component', 'Node', 'Label', 'Sprite', 'Color', 'director', 'UITransform', 'Graphics', 'EventTouch', 'Vec3', 'Button', 'input', 'Input']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("ResultController", ResultController = (_dec = ccclass('ResultController'), _dec2 = property(Label), _dec3 = property(Label), _dec4 = property(Node), _dec5 = property(Node), _dec6 = property(Node), _dec7 = property(Node), _dec(_class = (_class2 = class ResultController extends Component {
        constructor(...args) {
          super(...args);

          _initializerDefineProperty(this, "resultLabel", _descriptor, this);

          _initializerDefineProperty(this, "levelLabel", _descriptor2, this);

          _initializerDefineProperty(this, "nextButton", _descriptor3, this);

          _initializerDefineProperty(this, "replayButton", _descriptor4, this);

          _initializerDefineProperty(this, "menuButton", _descriptor5, this);

          _initializerDefineProperty(this, "backgroundNode", _descriptor6, this);

          this.storageManager = null;
          this.audioManager = null;
          this.isVictory = false;
          this.levelId = 1;
        }

        onLoad() {
          this.storageManager = this.addComponent(_crd && StorageManager === void 0 ? (_reportPossibleCrUseOfStorageManager({
            error: Error()
          }), StorageManager) : StorageManager);
          this.audioManager = this.addComponent(_crd && AudioManager === void 0 ? (_reportPossibleCrUseOfAudioManager({
            error: Error()
          }), AudioManager) : AudioManager);
          this.storageManager.init();
          this.audioManager.init(this.storageManager.getSettings()); // 从存储中获取当前关卡和结果

          this.levelId = this.storageManager.getCurrentLevel(); // 结果应该通过某种方式传递，这里简单判断关卡是否完成

          this.isVictory = this.storageManager.isLevelCompleted(this.levelId);
          this.setupUI();
          this.setupButtons();
        }
        /**
         * 设置 UI
         */


        setupUI() {
          // 设置背景颜色
          if (this.backgroundNode) {
            const graphics = this.backgroundNode.getComponent(Graphics) || this.backgroundNode.addComponent(Graphics);
            const transform = this.backgroundNode.getComponent(UITransform);

            if (transform) {
              graphics.fillColor = this.isVictory ? new Color(232, 245, 233, 255) : new Color(255, 235, 238, 255);
              graphics.rect(-transform.width / 2, -transform.height / 2, transform.width, transform.height);
              graphics.fill();
            }
          } // 设置结果文字


          if (this.resultLabel) {
            this.resultLabel.string = this.isVictory ? '胜利！' : '失败';
            this.resultLabel.color = this.isVictory ? new Color(76, 175, 80, 255) : new Color(244, 67, 54, 255);
          } // 设置关卡信息


          if (this.levelLabel) {
            this.levelLabel.string = `关卡 ${this.levelId}`;
          } // 根据结果显示/隐藏下一关按钮


          if (this.nextButton) {
            this.nextButton.active = this.isVictory;
          }
        }
        /**
         * 设置按钮事件
         */


        setupButtons() {
          if (this.nextButton) {
            this.nextButton.on(Input.EventType.TOUCH_END, this.onNextClick, this);
          }

          if (this.replayButton) {
            this.replayButton.on(Input.EventType.TOUCH_END, this.onReplayClick, this);
          }

          if (this.menuButton) {
            this.menuButton.on(Input.EventType.TOUCH_END, this.onMenuClick, this);
          }
        }
        /**
         * 下一关按钮点击
         */


        onNextClick() {
          var _this$audioManager;

          (_this$audioManager = this.audioManager) == null ? void 0 : _this$audioManager.playSound('click');
          const nextLevel = this.levelId + 1; // 查找 GameSceneController

          const sceneController = this.findGameSceneController();

          if (sceneController) {
            var _this$storageManager;

            // 隐藏结果面板
            if (typeof sceneController.hideResult === 'function') {
              sceneController.hideResult();
            } // 如果有下一关，加载下一关


            if ((_this$storageManager = this.storageManager) != null && _this$storageManager.isLevelUnlocked(nextLevel)) {
              this.storageManager.setCurrentLevel(nextLevel); // 重新加载游戏场景

              setTimeout(() => {
                director.loadScene('GameScene');
              }, 300);
            } else {
              // 没有下一关，返回菜单
              setTimeout(() => {
                director.loadScene('LaunchScene');
              }, 300);
            }
          } else {
            var _this$storageManager2;

            // 如果没有找到 GameSceneController，使用原来的逻辑
            if ((_this$storageManager2 = this.storageManager) != null && _this$storageManager2.isLevelUnlocked(nextLevel)) {
              this.storageManager.setCurrentLevel(nextLevel);
              director.loadScene('GameScene');
            } else {
              director.loadScene('LaunchScene');
            }
          }
        }
        /**
         * 重玩按钮点击
         */


        onReplayClick() {
          var _this$audioManager2;

          (_this$audioManager2 = this.audioManager) == null ? void 0 : _this$audioManager2.playSound('click'); // 查找 GameSceneController

          const sceneController = this.findGameSceneController();

          if (sceneController) {
            // 隐藏结果面板
            if (typeof sceneController.hideResult === 'function') {
              sceneController.hideResult();
            } // 重新开始当前关卡


            if (typeof sceneController.restartLevel === 'function') {
              setTimeout(() => {
                sceneController.restartLevel();
              }, 300);
            } else {
              setTimeout(() => {
                director.loadScene('GameScene');
              }, 300);
            }
          } else {
            director.loadScene('GameScene');
          }
        }
        /**
         * 返回菜单按钮点击
         */


        onMenuClick() {
          var _this$audioManager3;

          (_this$audioManager3 = this.audioManager) == null ? void 0 : _this$audioManager3.playSound('click'); // 查找 GameSceneController

          const sceneController = this.findGameSceneController();

          if (sceneController) {
            // 隐藏结果面板
            if (typeof sceneController.hideResult === 'function') {
              sceneController.hideResult();
            }
          }

          setTimeout(() => {
            director.loadScene('LaunchScene');
          }, 300);
        }
        /**
         * 查找 GameSceneController
         */


        findGameSceneController() {
          let parent = this.node.parent;

          while (parent) {
            const sceneController = parent.getComponent('GameSceneController');

            if (sceneController) {
              return sceneController;
            }

            parent = parent.parent;
          }

          return null;
        }
        /**
         * 初始化（用于从其他场景传递数据）
         */


        init(isVictory, levelId) {
          this.isVictory = isVictory;
          this.levelId = levelId; // 如果还没有初始化，先初始化

          if (!this.storageManager) {
            this.storageManager = this.addComponent(_crd && StorageManager === void 0 ? (_reportPossibleCrUseOfStorageManager({
              error: Error()
            }), StorageManager) : StorageManager);
            this.audioManager = this.addComponent(_crd && AudioManager === void 0 ? (_reportPossibleCrUseOfAudioManager({
              error: Error()
            }), AudioManager) : AudioManager);
            this.storageManager.init();
            this.audioManager.init(this.storageManager.getSettings());
            this.setupButtons();
          }

          this.setupUI();
        }

      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "resultLabel", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "levelLabel", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "nextButton", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "replayButton", [_dec5], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "menuButton", [_dec6], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, "backgroundNode", [_dec7], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      })), _class2)) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=4b8be3569ed6f3f632cfbc1e412a4cca53ec8d7c.js.map