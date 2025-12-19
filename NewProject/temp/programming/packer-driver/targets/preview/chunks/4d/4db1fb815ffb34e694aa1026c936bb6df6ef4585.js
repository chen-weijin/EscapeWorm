System.register(["cc"], function (_export, _context) {
  "use strict";

  var _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, Color, Graphics, _dec, _class, _crd, ccclass, property, EffectManager;

  return {
    setters: [function (_cc) {
      _cclegacy = _cc.cclegacy;
      __checkObsolete__ = _cc.__checkObsolete__;
      __checkObsoleteInNamespace__ = _cc.__checkObsoleteInNamespace__;
      _decorator = _cc._decorator;
      Component = _cc.Component;
      Color = _cc.Color;
      Graphics = _cc.Graphics;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "fa959SroppBnJJT1bybik0t", "EffectManager", undefined);
      /**
       * 特效管理器
       * 管理粒子特效和动画效果
       */


      __checkObsolete__(['_decorator', 'Component', 'Node', 'Vec3', 'Color', 'Graphics', 'UITransform', 'tween']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("EffectManager", EffectManager = (_dec = ccclass('EffectManager'), _dec(_class = class EffectManager extends Component {
        constructor() {
          super(...arguments);
          this.particles = [];
          this.graphics = null;
        }

        onLoad() {
          // 创建 Graphics 组件用于绘制粒子
          this.graphics = this.getComponent(Graphics) || this.addComponent(Graphics);
        }
        /**
         * 创建逃脱粒子特效
         */


        createEscapeEffect(position, color) {
          var particleCount = 20;

          for (var i = 0; i < particleCount; i++) {
            var angle = Math.PI * 2 * i / particleCount;
            var speed = 2 + Math.random() * 3;
            this.particles.push({
              x: position.x,
              y: position.y,
              vx: Math.cos(angle) * speed,
              vy: Math.sin(angle) * speed,
              color: color,
              life: 1.0,
              decay: 0.02 + Math.random() * 0.02,
              size: 3 + Math.random() * 3
            });
          }
        }
        /**
         * 创建胜利粒子特效
         */


        createVictoryEffect(center) {
          var particleCount = 50;
          var colors = ['#FFD700', '#FF6B6B', '#4ECDC4', '#95E1D3', '#F38181'];

          for (var i = 0; i < particleCount; i++) {
            var angle = Math.PI * 2 * i / particleCount;
            var speed = 3 + Math.random() * 4;
            this.particles.push({
              x: center.x,
              y: center.y,
              vx: Math.cos(angle) * speed,
              vy: Math.sin(angle) * speed,
              color: colors[Math.floor(Math.random() * colors.length)],
              life: 1.0,
              decay: 0.015 + Math.random() * 0.01,
              size: 4 + Math.random() * 4
            });
          }
        }
        /**
         * 创建高亮警示动画
         */


        createHighlightAnimation(targetNode, callback) {
          return new Promise(resolve => {
            var flashCount = 0;
            var maxFlashes = 6;
            var flashInterval = 100;

            var flash = () => {
              var _targetNode$getChildB;

              var isHighlighted = flashCount % 2 === 0; // 通过改变节点透明度实现闪烁

              (_targetNode$getChildB = targetNode.getChildByName('HighlightOverlay')) == null ? void 0 : _targetNode$getChildB.setScale(isHighlighted ? 1 : 0, 1, 1);
              flashCount++;

              if (flashCount < maxFlashes) {
                setTimeout(flash, flashInterval);
              } else {
                if (callback) callback();
                resolve();
              }
            };

            flash();
          });
        }
        /**
         * 更新所有粒子
         */


        update(dt) {
          if (!this.graphics) return; // 清空之前的绘制

          this.graphics.clear(); // 更新并绘制粒子

          for (var i = this.particles.length - 1; i >= 0; i--) {
            var particle = this.particles[i]; // 更新位置

            particle.x += particle.vx;
            particle.y += particle.vy; // 更新生命周期

            particle.life -= particle.decay; // 移除死亡粒子

            if (particle.life <= 0) {
              this.particles.splice(i, 1);
              continue;
            } // 绘制粒子


            this.drawParticle(particle);
          }
        }
        /**
         * 绘制单个粒子
         */


        drawParticle(particle) {
          if (!this.graphics) return;
          var color = this.hexToColor(particle.color, particle.life);
          this.graphics.fillColor = color;
          this.graphics.circle(particle.x, particle.y, particle.size);
          this.graphics.fill();
        }
        /**
         * 将十六进制颜色转换为 Color 对象
         */


        hexToColor(hex, alpha) {
          if (alpha === void 0) {
            alpha = 1;
          }

          var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

          if (result) {
            return new Color(parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16), Math.floor(alpha * 255));
          }

          return new Color(255, 255, 255, Math.floor(alpha * 255));
        }
        /**
         * 清除所有特效
         */


        clear() {
          this.particles = [];

          if (this.graphics) {
            this.graphics.clear();
          }
        }

      }) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=4db1fb815ffb34e694aa1026c936bb6df6ef4585.js.map