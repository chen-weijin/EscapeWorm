System.register(["cc"], function (_export, _context) {
  "use strict";

  var _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, Vec2, _dec, _class, _class2, _descriptor, _descriptor2, _descriptor3, _crd, ccclass, property, Worm;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }

  return {
    setters: [function (_cc) {
      _cclegacy = _cc.cclegacy;
      __checkObsolete__ = _cc.__checkObsolete__;
      __checkObsoleteInNamespace__ = _cc.__checkObsoleteInNamespace__;
      _decorator = _cc._decorator;
      Component = _cc.Component;
      Vec2 = _cc.Vec2;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "a3a48gXdD1MMoSaij6Yp1on", "Worm", undefined);
      /**
       * 蠕虫实体类
       */


      __checkObsolete__(['_decorator', 'Component', 'Node', 'Vec2', 'Vec3', 'Sprite', 'SpriteFrame', 'Color', 'tween', 'UITransform']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("Worm", Worm = (_dec = ccclass('Worm'), _dec(_class = (_class2 = class Worm extends Component {
        constructor() {
          super(...arguments);

          _initializerDefineProperty(this, "id", _descriptor, this);

          _initializerDefineProperty(this, "color", _descriptor2, this);

          _initializerDefineProperty(this, "direction", _descriptor3, this);

          // 身体段坐标数组
          this.segments = [];
          this.originalSegments = [];
          this.previousSegments = [];
          // 状态
          this.isEscaped = false;
          this.isHighlighted = false;
          this.isEscaping = false;
          this.isAnimating = false;
          // 显示相关
          this.visibleSegmentCount = 0;
          // 动画相关
          this.animationProgress = 1.0;
          this.animationDuration = 10;
          this.animationStartTime = 0;
          // 节点引用
          this.segmentNodes = [];
        }

        /**
         * 初始化蠕虫
         */
        init(config) {
          this.id = config.id;
          this.color = config.color; // 深拷贝原始位置

          this.originalSegments = config.segments.map(s => new Vec2(s.x, s.y));
          this.segments = config.segments.map(s => new Vec2(s.x, s.y));
          this.previousSegments = config.segments.map(s => new Vec2(s.x, s.y)); // 计算方向

          if (config.direction && ['up', 'down', 'left', 'right'].indexOf(config.direction) !== -1) {
            this.direction = config.direction;
          } else if (this.segments.length >= 2) {
            var first = this.segments[0];
            var second = this.segments[1];
            var dx = second.x - first.x;
            var dy = second.y - first.y;
            var bodyDirection = null;
            if (dx > 0) bodyDirection = 'right';else if (dx < 0) bodyDirection = 'left';else if (dy > 0) bodyDirection = 'down';else if (dy < 0) bodyDirection = 'up';
            var oppositeDirection = {
              'right': 'left',
              'left': 'right',
              'up': 'down',
              'down': 'up'
            };
            this.direction = bodyDirection ? oppositeDirection[bodyDirection] : 'right';
          }

          this.visibleSegmentCount = this.segments.length;
        }
        /**
         * 获取头部位置
         */


        getHeadPosition() {
          return this.segments[0];
        }
        /**
         * 获取身体段位置（不包括头部）
         */


        getBodySegments() {
          return this.segments.slice(1);
        }
        /**
         * 获取所有段位置
         */


        getAllSegments() {
          return this.segments;
        }
        /**
         * 获取插值后的段位置（用于平滑渲染）
         */


        getInterpolatedSegments(progress) {
          if (progress === void 0) {
            progress = null;
          }

          if (progress === null) {
            progress = this.animationProgress;
          }

          if (progress >= 1.0 || !this.isAnimating) {
            return this.segments;
          }

          var interpolated = [];

          for (var i = 0; i < this.segments.length; i++) {
            var prevSeg = this.previousSegments[i] || this.segments[i];
            var currSeg = this.segments[i];
            interpolated.push(new Vec2(prevSeg.x + (currSeg.x - prevSeg.x) * progress, prevSeg.y + (currSeg.y - prevSeg.y) * progress));
          }

          return interpolated;
        }
        /**
         * 开始移动动画
         */


        startMoveAnimation(newHeadPosition, duration) {
          if (duration === void 0) {
            duration = 40;
          }

          return new Promise(resolve => {
            if (this.isEscaped) {
              resolve();
              return;
            } // 保存当前位置作为动画起始位置


            this.previousSegments = this.segments.map(s => new Vec2(s.x, s.y)); // 新头部在开头

            var newSegments = [newHeadPosition]; // 身体段跟随

            for (var i = 0; i < this.segments.length - 1; i++) {
              newSegments.push(new Vec2(this.segments[i].x, this.segments[i].y));
            }

            this.segments = newSegments; // 开始动画

            this.animationProgress = 0;
            this.isAnimating = true;
            this.animationDuration = duration;
            this.animationStartTime = Date.now(); // 使用 setTimeout 模拟动画完成

            setTimeout(() => {
              this.completeAnimation();
              resolve();
            }, duration);
          });
        }
        /**
         * 更新动画进度
         */


        updateAnimation(currentTime) {
          if (!this.isAnimating) {
            return true;
          }

          var elapsed = currentTime - this.animationStartTime;
          this.animationProgress = Math.min(elapsed / this.animationDuration, 1.0);

          if (this.animationProgress >= 1.0) {
            this.isAnimating = false;
            return true;
          }

          return false;
        }
        /**
         * 立即完成动画
         */


        completeAnimation() {
          this.animationProgress = 1.0;
          this.isAnimating = false;
          this.previousSegments = this.segments.map(s => new Vec2(s.x, s.y));
        }
        /**
         * 移动蠕虫到新位置（立即移动，不使用动画）
         */


        moveTo(newHeadPosition) {
          if (this.isEscaped) {
            return;
          }

          var newSegments = [newHeadPosition];

          for (var i = 0; i < this.segments.length - 1; i++) {
            newSegments.push(new Vec2(this.segments[i].x, this.segments[i].y));
          }

          this.segments = newSegments;
          this.previousSegments = this.segments.map(s => new Vec2(s.x, s.y));
          this.isAnimating = false;
          this.animationProgress = 1.0;
        }
        /**
         * 复位到原始位置
         */


        reset() {
          var _this$segments$, _this$segments$2;

          console.log("\u8815\u866B " + this.id + " reset: \u539F\u59CB\u4F4D\u7F6E\u6570\u91CF=" + this.originalSegments.length); // 验证原始位置数据

          if (this.originalSegments.length === 0) {
            console.error("\u9519\u8BEF\uFF1A\u8815\u866B " + this.id + " \u7684 originalSegments \u4E3A\u7A7A\uFF01\u65E0\u6CD5\u91CD\u7F6E\uFF01");
            return;
          }

          this.segments = this.originalSegments.map(s => new Vec2(s.x, s.y));
          this.previousSegments = this.originalSegments.map(s => new Vec2(s.x, s.y));
          this.isEscaped = false;
          this.isHighlighted = false;
          this.isAnimating = false;
          this.isEscaping = false;
          this.animationProgress = 1.0;
          this.visibleSegmentCount = this.segments.length; // 验证重置后的数据

          if (this.segments.length === 0) {
            console.error("\u9519\u8BEF\uFF1A\u8815\u866B " + this.id + " reset \u540E segments \u4E3A\u7A7A\uFF01");
          }

          if (this.visibleSegmentCount === 0) {
            console.error("\u9519\u8BEF\uFF1A\u8815\u866B " + this.id + " reset \u540E visibleSegmentCount=0\uFF01");
          }

          console.log("\u8815\u866B " + this.id + " reset\u5B8C\u6210: segments=" + this.segments.length + ", visibleCount=" + this.visibleSegmentCount + ", \u5934\u90E8=(" + ((_this$segments$ = this.segments[0]) == null ? void 0 : _this$segments$.x) + ", " + ((_this$segments$2 = this.segments[0]) == null ? void 0 : _this$segments$2.y) + ")");
        }
        /**
         * 设置可见段数量
         */


        setVisibleSegmentCount(count) {
          this.visibleSegmentCount = Math.max(0, Math.min(count, this.segments.length));
        }
        /**
         * 获取可见的段
         */


        getVisibleSegments() {
          if (this.visibleSegmentCount >= this.segments.length) {
            return this.segments;
          }

          return this.segments.slice(-this.visibleSegmentCount);
        }
        /**
         * 设置高亮状态
         */


        setHighlighted(highlighted) {
          this.isHighlighted = highlighted;
        }
        /**
         * 标记为已逃脱
         */


        markEscaped() {
          this.isEscaped = true;
        }
        /**
         * 检查蠕虫是否已逃脱
         */


        hasEscaped() {
          return this.isEscaped;
        }
        /**
         * 获取蠕虫长度
         */


        getLength() {
          return this.segments.length;
        }
        /**
         * 获取蠕虫配置
         */


        getConfig() {
          return {
            id: this.id,
            segments: this.segments.map(s => ({
              x: s.x,
              y: s.y
            })),
            direction: this.direction,
            color: this.color
          };
        }

      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "id", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 0;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "color", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return '#FF5733';
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "direction", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 'right';
        }
      })), _class2)) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=268b79faf053b4487b4140a0873214488a74b2de.js.map