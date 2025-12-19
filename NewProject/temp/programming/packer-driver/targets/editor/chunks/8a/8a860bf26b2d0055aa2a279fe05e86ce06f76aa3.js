System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2", "__unresolved_3"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, Node, Label, Color, director, UITransform, Graphics, Vec3, Input, StorageManager, AudioManager, Logger, _dec, _dec2, _dec3, _class, _class2, _descriptor, _descriptor2, _crd, ccclass, property, MenuController;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }

  function _reportPossibleCrUseOfStorageManager(extras) {
    _reporterNs.report("StorageManager", "../managers/StorageManager", _context.meta, extras);
  }

  function _reportPossibleCrUseOfAudioManager(extras) {
    _reporterNs.report("AudioManager", "../managers/AudioManager", _context.meta, extras);
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
      UITransform = _cc.UITransform;
      Graphics = _cc.Graphics;
      Vec3 = _cc.Vec3;
      Input = _cc.Input;
    }, function (_unresolved_2) {
      StorageManager = _unresolved_2.StorageManager;
    }, function (_unresolved_3) {
      AudioManager = _unresolved_3.AudioManager;
    }, function (_unresolved_4) {
      Logger = _unresolved_4.Logger;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "dacb8YqZfhLlLu90mu03VrL", "MenuController", undefined);
      /**
       * 菜单场景控制器
       */


      __checkObsolete__(['_decorator', 'Component', 'Node', 'Label', 'Sprite', 'Color', 'director', 'UITransform', 'Graphics', 'EventTouch', 'Vec3', 'input', 'Input']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("MenuController", MenuController = (_dec = ccclass('MenuController'), _dec2 = property(Node), _dec3 = property(Label), _dec(_class = (_class2 = class MenuController extends Component {
        constructor(...args) {
          super(...args);

          _initializerDefineProperty(this, "levelGrid", _descriptor, this);

          _initializerDefineProperty(this, "titleLabel", _descriptor2, this);

          this.storageManager = null;
          this.audioManager = null;
          this.levels = [];
          this.totalLevels = 3;
          // 布局参数
          this.cols = 3;
          this.cellSize = 200;
          this.startX = 0;
          this.startY = 0;
        }

        onLoad() {
          this.storageManager = this.addComponent(_crd && StorageManager === void 0 ? (_reportPossibleCrUseOfStorageManager({
            error: Error()
          }), StorageManager) : StorageManager);
          this.audioManager = this.addComponent(_crd && AudioManager === void 0 ? (_reportPossibleCrUseOfAudioManager({
            error: Error()
          }), AudioManager) : AudioManager);
          this.storageManager.init();
          this.audioManager.init(this.storageManager.getSettings());
          this.initLevels();
          this.createLevelButtons(); // 注册触摸事件

          if (this.levelGrid) {
            this.levelGrid.on(Input.EventType.TOUCH_END, this.onTouchEnd, this);
          }
        }
        /**
         * 初始化关卡信息
         */


        initLevels() {
          this.levels = [];

          for (let i = 1; i <= this.totalLevels; i++) {
            this.levels.push({
              id: i,
              unlocked: this.storageManager.isLevelUnlocked(i),
              completed: this.storageManager.isLevelCompleted(i)
            });
          }
        }
        /**
         * 创建关卡按钮
         */


        createLevelButtons() {
          if (!this.levelGrid) return;
          const transform = this.levelGrid.getComponent(UITransform);
          if (!transform) return;
          const gridWidth = transform.width;
          const gridHeight = transform.height;
          const rows = Math.ceil(this.levels.length / this.cols);
          this.cellSize = Math.min(gridWidth / this.cols, gridHeight / rows) * 0.85;
          this.startX = -(this.cols * this.cellSize) / 2 + this.cellSize / 2;
          this.startY = (rows - 1) * this.cellSize / 2;

          for (let i = 0; i < this.levels.length; i++) {
            const level = this.levels[i];
            const row = Math.floor(i / this.cols);
            const col = i % this.cols;
            const x = this.startX + col * this.cellSize;
            const y = this.startY - row * this.cellSize;
            this.createLevelButton(level, x, y);
          }
        }
        /**
         * 创建单个关卡按钮
         */


        createLevelButton(level, x, y) {
          const buttonNode = new Node(`Level_${level.id}`);
          buttonNode.parent = this.levelGrid;
          buttonNode.setPosition(x, y, 0); // 添加 UITransform

          const transform = buttonNode.addComponent(UITransform);
          transform.width = this.cellSize * 0.8;
          transform.height = this.cellSize * 0.8; // 添加 Graphics 绘制按钮

          const graphics = buttonNode.addComponent(Graphics);
          const radius = this.cellSize / 2 - 20; // 绘制按钮背景

          if (level.unlocked) {
            graphics.fillColor = level.completed ? new Color(76, 175, 80, 255) : new Color(33, 150, 243, 255);
          } else {
            graphics.fillColor = new Color(200, 200, 200, 255);
          }

          graphics.circle(0, 0, radius);
          graphics.fill(); // 绘制边框

          graphics.strokeColor = level.unlocked ? level.completed ? new Color(56, 142, 60, 255) : new Color(25, 118, 210, 255) : new Color(150, 150, 150, 255);
          graphics.lineWidth = 4;
          graphics.stroke(); // 添加关卡编号标签

          const labelNode = new Node('Label');
          labelNode.parent = buttonNode;
          const label = labelNode.addComponent(Label);
          label.string = level.unlocked ? level.id.toString() : '🔒';
          label.fontSize = 48;
          label.color = new Color(255, 255, 255, 255);
          labelNode.addComponent(UITransform); // 添加完成标记

          if (level.completed) {
            const checkNode = new Node('Check');
            checkNode.parent = buttonNode;
            checkNode.setPosition(radius * 0.5, radius * 0.5, 0);
            const checkLabel = checkNode.addComponent(Label);
            checkLabel.string = '✓';
            checkLabel.fontSize = 32;
            checkLabel.color = new Color(255, 215, 0, 255);
            checkNode.addComponent(UITransform);
          }
        }
        /**
         * 处理触摸事件
         */


        onTouchEnd(event) {
          var _this$levelGrid;

          const location = event.getUILocation();
          const transform = (_this$levelGrid = this.levelGrid) == null ? void 0 : _this$levelGrid.getComponent(UITransform);
          if (!transform) return;
          const localPos = transform.convertToNodeSpaceAR(new Vec3(location.x, location.y, 0)); // 检查点击的关卡

          for (let i = 0; i < this.levels.length; i++) {
            const level = this.levels[i];
            const row = Math.floor(i / this.cols);
            const col = i % this.cols;
            const levelX = this.startX + col * this.cellSize;
            const levelY = this.startY - row * this.cellSize;
            const radius = this.cellSize / 2 - 20;
            const dx = localPos.x - levelX;
            const dy = localPos.y - levelY;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < radius) {
              this.onLevelClick(level);
              return;
            }
          }
        }
        /**
         * 关卡点击处理
         */


        onLevelClick(level) {
          var _this$audioManager;

          (_this$audioManager = this.audioManager) == null ? void 0 : _this$audioManager.playSound('click');

          if (level.unlocked) {
            var _this$storageManager;

            (_crd && Logger === void 0 ? (_reportPossibleCrUseOfLogger({
              error: Error()
            }), Logger) : Logger).log(`开始关卡 ${level.id}`); // 保存当前关卡并切换场景

            (_this$storageManager = this.storageManager) == null ? void 0 : _this$storageManager.setCurrentLevel(level.id);
            director.loadScene('GameScene');
          } else {
            (_crd && Logger === void 0 ? (_reportPossibleCrUseOfLogger({
              error: Error()
            }), Logger) : Logger).log('关卡未解锁');
          }
        }

      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "levelGrid", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "titleLabel", [_dec3], {
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
//# sourceMappingURL=8a860bf26b2d0055aa2a279fe05e86ce06f76aa3.js.map