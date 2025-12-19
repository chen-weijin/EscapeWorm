System.register(["__unresolved_0", "cc", "__unresolved_1"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, Node, director, StorageManager, _dec, _dec2, _dec3, _class, _class2, _descriptor, _descriptor2, _crd, ccclass, property, Main;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }

  function _reportPossibleCrUseOfStorageManager(extras) {
    _reporterNs.report("StorageManager", "./managers/StorageManager", _context.meta, extras);
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
      director = _cc.director;
    }, function (_unresolved_2) {
      StorageManager = _unresolved_2.StorageManager;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "4b600rbtmlHEoGIsAUERyFf", "Main", undefined);
      /**
       * 游戏主入口脚本
       * 将此脚本挂载到 LaunchScene 的 Canvas 节点上
       */


      __checkObsolete__(['_decorator', 'Component', 'Node', 'director', 'Button', 'EventHandler']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("Main", Main = (_dec = ccclass('Main'), _dec2 = property(Node), _dec3 = property(Node), _dec(_class = (_class2 = class Main extends Component {
        constructor() {
          super(...arguments);

          _initializerDefineProperty(this, "startButton", _descriptor, this);

          _initializerDefineProperty(this, "settingButton", _descriptor2, this);

          this.storageManager = null;
        }

        onLoad() {
          // 初始化存储管理器
          this.storageManager = this.addComponent(_crd && StorageManager === void 0 ? (_reportPossibleCrUseOfStorageManager({
            error: Error()
          }), StorageManager) : StorageManager);
          this.storageManager.init(); // 绑定按钮事件

          if (this.startButton) {
            this.startButton.on(Node.EventType.TOUCH_END, this.onStartGame, this);
          }

          if (this.settingButton) {
            this.settingButton.on(Node.EventType.TOUCH_END, this.onOpenSettings, this);
          }
        }
        /**
         * 开始游戏
         */


        onStartGame() {
          console.log('开始游戏');
          director.loadScene('GameScene');
        }
        /**
         * 打开设置
         */


        onOpenSettings() {
          console.log('打开设置'); // TODO: 显示设置面板
        }

      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "startButton", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "settingButton", [_dec3], {
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
//# sourceMappingURL=68009cf5fa5a1bc97f7e23a6147c9f362cf6bbfd.js.map