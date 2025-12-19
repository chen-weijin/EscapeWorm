System.register(["__unresolved_0", "cc", "__unresolved_1"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, Node, director, Label, StorageManager, _dec, _dec2, _dec3, _class, _class2, _descriptor, _descriptor2, _crd, ccclass, property, LaunchController;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }

  function _reportPossibleCrUseOfStorageManager(extras) {
    _reporterNs.report("StorageManager", "../managers/StorageManager", _context.meta, extras);
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
      Label = _cc.Label;
    }, function (_unresolved_2) {
      StorageManager = _unresolved_2.StorageManager;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "760960yNMRDP6+TShJJK3sR", "LaunchController", undefined);
      /**
       * 启动场景控制器
       */


      __checkObsolete__(['_decorator', 'Component', 'Node', 'director', 'Label']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("LaunchController", LaunchController = (_dec = ccclass('LaunchController'), _dec2 = property(Label), _dec3 = property(Node), _dec(_class = (_class2 = class LaunchController extends Component {
        constructor() {
          super(...arguments);

          _initializerDefineProperty(this, "titleLabel", _descriptor, this);

          _initializerDefineProperty(this, "startButton", _descriptor2, this);

          this.storageManager = null;
        }

        onLoad() {
          this.storageManager = this.addComponent(_crd && StorageManager === void 0 ? (_reportPossibleCrUseOfStorageManager({
            error: Error()
          }), StorageManager) : StorageManager);
          this.storageManager.init(); // 设置标题

          if (this.titleLabel) {
            this.titleLabel.string = '蠕虫逃脱';
          } // 自动进入菜单场景


          this.scheduleOnce(() => {
            this.enterMenu();
          }, 1);
        }
        /**
         * 进入菜单
         */


        enterMenu() {
          director.loadScene('GameScene');
        }
        /**
         * 开始游戏按钮点击
         */


        onStartClick() {
          this.enterMenu();
        }

      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "titleLabel", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "startButton", [_dec3], {
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
//# sourceMappingURL=a8622edaa6e35ec0a342696399268c24a77fd265.js.map