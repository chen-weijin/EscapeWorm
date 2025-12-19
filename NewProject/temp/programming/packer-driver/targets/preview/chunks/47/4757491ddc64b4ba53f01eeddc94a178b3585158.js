System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2", "__unresolved_3", "__unresolved_4"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, Node, Label, Color, director, Graphics, Vec3, tween, Slider, GameController, StorageManager, ResultController, Logger, _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _dec9, _dec10, _dec11, _dec12, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _descriptor8, _descriptor9, _descriptor10, _descriptor11, _crd, ccclass, property, GameSceneController;

  function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

  function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }

  function _reportPossibleCrUseOfGameController(extras) {
    _reporterNs.report("GameController", "../GameController", _context.meta, extras);
  }

  function _reportPossibleCrUseOfStorageManager(extras) {
    _reporterNs.report("StorageManager", "../managers/StorageManager", _context.meta, extras);
  }

  function _reportPossibleCrUseOfResultController(extras) {
    _reporterNs.report("ResultController", "./ResultController", _context.meta, extras);
  }

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
      Node = _cc.Node;
      Label = _cc.Label;
      Color = _cc.Color;
      director = _cc.director;
      Graphics = _cc.Graphics;
      Vec3 = _cc.Vec3;
      tween = _cc.tween;
      Slider = _cc.Slider;
    }, function (_unresolved_2) {
      GameController = _unresolved_2.GameController;
    }, function (_unresolved_3) {
      StorageManager = _unresolved_3.StorageManager;
    }, function (_unresolved_4) {
      ResultController = _unresolved_4.ResultController;
    }, function (_unresolved_5) {
      Logger = _unresolved_5.Logger;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "7e906J/jvFCEL9MGDgd+omF", "GameSceneController", undefined);
      /**
       * 游戏场景控制器
       * 用于管理 GameScene 中的 UI 和游戏逻辑初始化
       */


      __checkObsolete__(['_decorator', 'Component', 'Node', 'Label', 'Sprite', 'Color', 'director', 'Button', 'Graphics', 'UITransform', 'Vec3', 'tween', 'Slider']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("GameSceneController", GameSceneController = (_dec = ccclass('GameSceneController'), _dec2 = property(Node), _dec3 = property(Label), _dec4 = property([Node]), _dec5 = property(Node), _dec6 = property(Node), _dec7 = property(Node), _dec8 = property(Node), _dec9 = property(Label), _dec10 = property(Node), _dec11 = property(Slider), _dec12 = property(Label), _dec(_class = (_class2 = class GameSceneController extends Component {
        constructor() {
          super(...arguments);

          _initializerDefineProperty(this, "gameArea", _descriptor, this);

          _initializerDefineProperty(this, "levelLabel", _descriptor2, this);

          _initializerDefineProperty(this, "heartNodes", _descriptor3, this);

          _initializerDefineProperty(this, "settingsButton", _descriptor4, this);

          _initializerDefineProperty(this, "menuButton", _descriptor5, this);

          _initializerDefineProperty(this, "restartButton", _descriptor6, this);

          _initializerDefineProperty(this, "resultPanel", _descriptor7, this);

          _initializerDefineProperty(this, "resultLabel", _descriptor8, this);

          _initializerDefineProperty(this, "nextButton", _descriptor9, this);

          _initializerDefineProperty(this, "zoomSlider", _descriptor10, this);

          _initializerDefineProperty(this, "zoomLabel", _descriptor11, this);

          this.gameController = null;
          this.storageManager = null;
          this.currentLevelId = 1;
          this.lastZoomProgress = -1;
        }

        // 记录上次的滑块值
        onLoad() {
          // 初始化存储管理器获取当前关卡
          this.storageManager = this.addComponent(_crd && StorageManager === void 0 ? (_reportPossibleCrUseOfStorageManager({
            error: Error()
          }), StorageManager) : StorageManager);
          this.storageManager.init();
          this.currentLevelId = this.storageManager.getCurrentLevel(); // 隐藏结果面板

          if (this.resultPanel) {
            this.resultPanel.active = false;
          } // 设置按钮事件


          this.setupButtons(); // 设置缩放滑块

          this.setupZoomSlider(); // 初始化游戏控制器

          this.initGameController();
        }
        /**
         * 初始化游戏控制器
         */


        initGameController() {
          var _this = this;

          return _asyncToGenerator(function* () {
            if (!_this.gameArea) {
              (_crd && Logger === void 0 ? (_reportPossibleCrUseOfLogger({
                error: Error()
              }), Logger) : Logger).error('游戏区域节点未设置');
              return;
            } // 创建游戏控制器节点


            var controllerNode = new Node('GameController');
            controllerNode.parent = _this.node;
            _this.gameController = controllerNode.addComponent(_crd && GameController === void 0 ? (_reportPossibleCrUseOfGameController({
              error: Error()
            }), GameController) : GameController); // 设置游戏控制器的属性

            _this.gameController.gameArea = _this.gameArea;
            _this.gameController.levelLabel = _this.levelLabel;
            _this.gameController.heartNodes = _this.heartNodes; // 设置 GameSceneController 的引用，以便 GameController 可以调用 showResult

            _this.gameController.gameSceneController = _this.node; // 初始化关卡

            try {
              yield _this.gameController.initLevel(_this.currentLevelId);

              _this.updateLevelLabel();
            } catch (error) {
              (_crd && Logger === void 0 ? (_reportPossibleCrUseOfLogger({
                error: Error()
              }), Logger) : Logger).error('初始化关卡失败:', error);

              _this.showError('加载关卡失败');
            }
          })();
        }
        /**
         * 设置按钮事件
         */


        setupButtons() {
          if (this.settingsButton) {
            this.settingsButton.on(Node.EventType.TOUCH_END, this.onSettingsClick, this);
          }

          if (this.menuButton) {
            this.menuButton.on(Node.EventType.TOUCH_END, this.onMenuClick, this);
          }

          if (this.restartButton) {
            this.restartButton.on(Node.EventType.TOUCH_END, this.onRestartClick, this);
          }

          if (this.nextButton) {
            this.nextButton.on(Node.EventType.TOUCH_END, this.onNextClick, this);
          }
        }
        /**
         * 设置缩放滑块
         */


        setupZoomSlider() {
          if (this.zoomSlider) {
            // 设置初始值（1.0 = 100%）
            this.zoomSlider.progress = 0.5; // 默认50%，对应缩放比例0.5到1.5之间

            this.lastZoomProgress = this.zoomSlider.progress; // 使用 update 方法定期检查滑块值变化
            // 这样更可靠，不依赖特定的事件系统
            // 更新标签显示

            this.updateZoomLabel();
          }
        }
        /**
         * 更新方法，检查滑块值变化
         */


        update(dt) {
          if (this.zoomSlider && this.lastZoomProgress !== this.zoomSlider.progress) {
            this.lastZoomProgress = this.zoomSlider.progress;
            this.onZoomSliderChange();
          }
        }
        /**
         * 缩放滑块值变化回调
         */


        onZoomSliderChange() {
          if (!this.zoomSlider) return; // 将滑块进度值（0-1）转换为缩放比例（0.5-1.5）

          var zoomScale = 0.5 + this.zoomSlider.progress * 1.0; // 范围：0.5 到 1.5
          // 应用缩放

          if (this.gameController) {
            this.gameController.setZoomScale(zoomScale);
          } // 更新标签显示


          this.updateZoomLabel(zoomScale);
        }
        /**
         * 更新缩放标签显示
         */


        updateZoomLabel(zoomScale) {
          if (this.zoomLabel && this.zoomSlider) {
            if (zoomScale === undefined) {
              zoomScale = 0.5 + this.zoomSlider.progress * 1.0;
            }

            this.zoomLabel.string = Math.round(zoomScale * 100) + "%";
          }
        }
        /**
         * 更新关卡标签
         */


        updateLevelLabel() {
          if (this.levelLabel) {
            this.levelLabel.string = "\u5173\u5361 " + this.currentLevelId;
          }
        }
        /**
         * 设置按钮点击
         */


        onSettingsClick() {
          (_crd && Logger === void 0 ? (_reportPossibleCrUseOfLogger({
            error: Error()
          }), Logger) : Logger).log('打开设置'); // TODO: 实现设置面板
        }
        /**
         * 返回菜单按钮点击
         */


        onMenuClick() {
          director.loadScene('LaunchScene');
        }
        /**
         * 重新开始按钮点击
         */


        onRestartClick() {
          var _this$gameController;

          (_this$gameController = this.gameController) == null ? void 0 : _this$gameController.restartLevel();
        }
        /**
         * 重新开始关卡（供 ResultController 调用）
         */


        restartLevel() {
          var _this$gameController2;

          this.hideResult();
          (_this$gameController2 = this.gameController) == null ? void 0 : _this$gameController2.restartLevel();
        }
        /**
         * 下一关按钮点击
         */


        onNextClick() {
          var _this$gameController3;

          (_this$gameController3 = this.gameController) == null ? void 0 : _this$gameController3.nextLevel();
        }
        /**
         * 显示结果弹窗
         */


        showResult(isVictory, levelId) {
          if (!this.resultPanel) {
            (_crd && Logger === void 0 ? (_reportPossibleCrUseOfLogger({
              error: Error()
            }), Logger) : Logger).error('结果面板未设置');
            return;
          } // 获取 ResultController 组件


          var resultController = this.resultPanel.getComponent(_crd && ResultController === void 0 ? (_reportPossibleCrUseOfResultController({
            error: Error()
          }), ResultController) : ResultController);

          if (!resultController) {
            (_crd && Logger === void 0 ? (_reportPossibleCrUseOfLogger({
              error: Error()
            }), Logger) : Logger).warn('结果面板上没有 ResultController 组件，尝试添加');
            resultController = this.resultPanel.addComponent(_crd && ResultController === void 0 ? (_reportPossibleCrUseOfResultController({
              error: Error()
            }), ResultController) : ResultController);
          } // 初始化结果控制器


          resultController.init(isVictory, levelId); // 显示弹窗（带动画效果）

          this.resultPanel.active = true; // 设置初始缩放为0，然后动画到1

          this.resultPanel.setScale(0, 0, 1);
          tween(this.resultPanel).to(0.3, {
            scale: new Vec3(1, 1, 1)
          }, {
            easing: 'backOut'
          }).start();
        }
        /**
         * 隐藏结果弹窗
         */


        hideResult() {
          if (!this.resultPanel) {
            return;
          } // 动画隐藏


          tween(this.resultPanel).to(0.2, {
            scale: new Vec3(0, 0, 1)
          }, {
            easing: 'backIn'
          }).call(() => {
            this.resultPanel.active = false;
          }).start();
        }
        /**
         * 显示错误信息
         */


        showError(message) {
          (_crd && Logger === void 0 ? (_reportPossibleCrUseOfLogger({
            error: Error()
          }), Logger) : Logger).error(message); // TODO: 显示错误提示 UI
        }
        /**
         * 更新红心显示
         */


        updateHearts(failCount) {
          for (var i = 0; i < this.heartNodes.length; i++) {
            if (this.heartNodes[i]) {
              var graphics = this.heartNodes[i].getComponent(Graphics);

              if (graphics) {
                graphics.clear();
                graphics.fillColor = i < failCount ? new Color(244, 67, 54, 255) : new Color(200, 200, 200, 255);
                graphics.circle(0, 0, 20);
                graphics.fill();
              }
            }
          }
        }

      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "gameArea", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "levelLabel", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "heartNodes", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return [];
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "settingsButton", [_dec5], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "menuButton", [_dec6], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, "restartButton", [_dec7], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor7 = _applyDecoratedDescriptor(_class2.prototype, "resultPanel", [_dec8], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor8 = _applyDecoratedDescriptor(_class2.prototype, "resultLabel", [_dec9], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor9 = _applyDecoratedDescriptor(_class2.prototype, "nextButton", [_dec10], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor10 = _applyDecoratedDescriptor(_class2.prototype, "zoomSlider", [_dec11], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor11 = _applyDecoratedDescriptor(_class2.prototype, "zoomLabel", [_dec12], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      })), _class2)) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=4757491ddc64b4ba53f01eeddc94a178b3585158.js.map