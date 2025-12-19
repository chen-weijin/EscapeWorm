System.register(["__unresolved_0", "cc", "__unresolved_1"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, Vec2, PathFinder, CollisionDetector, _crd;

  function _reportPossibleCrUseOfPathFinder(extras) {
    _reporterNs.report("PathFinder", "./PathFinder", _context.meta, extras);
  }

  _export("CollisionDetector", void 0);

  return {
    setters: [function (_unresolved_) {
      _reporterNs = _unresolved_;
    }, function (_cc) {
      _cclegacy = _cc.cclegacy;
      __checkObsolete__ = _cc.__checkObsolete__;
      __checkObsoleteInNamespace__ = _cc.__checkObsoleteInNamespace__;
      Vec2 = _cc.Vec2;
    }, function (_unresolved_2) {
      PathFinder = _unresolved_2.PathFinder;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "0e09cFWASZKmrIICHqkxHww", "CollisionDetector", undefined);
      /**
       * 碰撞检测工具类
       */


      __checkObsolete__(['Vec2']);

      _export("CollisionDetector", CollisionDetector = class CollisionDetector {
        /**
         * 检测蠕虫移动到新位置是否会碰撞
         */
        static checkCollision(worm, newPosition, allWorms) {
          for (const otherWorm of allWorms) {
            // 跳过自己
            if (otherWorm.id === worm.id) {
              continue;
            } // 跳过已逃脱的蠕虫


            if (otherWorm.isEscaped) {
              continue;
            } // 跳过正在逃脱的蠕虫


            if (otherWorm.isEscaping) {
              continue;
            } // 跳过正在移动的蠕虫


            if (otherWorm.isAnimating) {
              continue;
            } // 检查新位置是否与其他蠕虫的任何段重叠


            for (const segment of otherWorm.segments) {
              if (segment.x === newPosition.x && segment.y === newPosition.y) {
                return true;
              }
            }
          }

          return false;
        }
        /**
         * 预测蠕虫下一步是否会碰撞
         */


        static willCollide(worm, allWorms) {
          const headPos = worm.segments[0];
          const direction = (_crd && PathFinder === void 0 ? (_reportPossibleCrUseOfPathFinder({
            error: Error()
          }), PathFinder) : PathFinder).getDirectionVector(worm.direction);
          const nextPosition = new Vec2(headPos.x + direction.x, headPos.y + direction.y);
          return this.checkCollision(worm, nextPosition, allWorms);
        }
        /**
         * 检查位置是否在矩阵范围内
         */


        static isInBounds(position, matrixWidth, matrixHeight) {
          return position.x >= 0 && position.x < matrixWidth && position.y >= 0 && position.y < matrixHeight;
        }
        /**
         * 检查位置是否与其他蠕虫的任何部分重叠
         */


        static isPositionOccupied(position, allWorms, excludeWormId = null) {
          for (const worm of allWorms) {
            if (excludeWormId !== null && worm.id === excludeWormId) {
              continue;
            }

            for (const segment of worm.segments) {
              if (segment.x === position.x && segment.y === position.y) {
                return true;
              }
            }
          }

          return false;
        }

      });

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=7c0707377faf757d5134d6927c905091322efca2.js.map