System.register(["cc"], function (_export, _context) {
  "use strict";

  var _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, Vec2, PathFinder, _crd;

  _export("PathFinder", void 0);

  return {
    setters: [function (_cc) {
      _cclegacy = _cc.cclegacy;
      __checkObsolete__ = _cc.__checkObsolete__;
      __checkObsoleteInNamespace__ = _cc.__checkObsoleteInNamespace__;
      Vec2 = _cc.Vec2;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "a9875fmnjZAvqy2U02mcCm+", "PathFinder", undefined);
      /**
       * 路径查找工具类
       * 使用直线路径查找蠕虫从当前位置到边界的逃脱路径
       */


      __checkObsolete__(['Vec2']);

      _export("PathFinder", PathFinder = class PathFinder {
        /**
         * 查找从蠕虫当前位置到边界的路径
         * 蠕虫只能沿着头部方向向前移动，不能拐弯
         */
        static findPath(headPos, direction, wormLength, segments, matrixWidth, matrixHeight, obstacles, escapePoints) {
          const directionVec = this.getDirectionVector(direction); // 创建蠕虫段的副本，用于模拟移动

          let simulatedSegments = segments.map(s => new Vec2(s.x, s.y));
          let currentX = headPos.x;
          let currentY = headPos.y;
          const path = [];

          while (true) {
            const nextX = currentX + directionVec.x;
            const nextY = currentY + directionVec.y; // 检查是否超出边界（可以逃脱）

            if (nextX < 0 || nextX >= matrixWidth || nextY < 0 || nextY >= matrixHeight) {
              // 可以逃脱，添加到路径
              path.push(new Vec2(nextX, nextY)); // 继续添加额外的步数，让整个蠕虫都能离开屏幕

              for (let i = 1; i < wormLength; i++) {
                const extraX = nextX + directionVec.x * i;
                const extraY = nextY + directionVec.y * i;
                path.push(new Vec2(extraX, extraY));
              }

              return {
                canEscape: true,
                path: path
              };
            } // 检查头部位置是否是障碍物


            const isHeadObstacle = obstacles.some(obs => obs.x === nextX && obs.y === nextY);

            if (isHeadObstacle) {
              return {
                canEscape: false,
                path: [],
                pathToObstacle: path
              };
            } // 检查蠕虫的身体段在移动后是否会与障碍物碰撞


            let bodyCollision = false;

            for (let i = 0; i < simulatedSegments.length - 1; i++) {
              const nextSegmentPos = new Vec2(simulatedSegments[i].x, simulatedSegments[i].y);
              const isBodyObstacle = obstacles.some(obs => obs.x === nextSegmentPos.x && obs.y === nextSegmentPos.y);

              if (isBodyObstacle) {
                bodyCollision = true;
                break;
              }
            }

            if (bodyCollision) {
              return {
                canEscape: false,
                path: [],
                pathToObstacle: path
              };
            } // 检查是否到达逃脱点


            for (const escapePoint of escapePoints) {
              if (nextX === escapePoint.x && nextY === escapePoint.y) {
                path.push(new Vec2(nextX, nextY));
                return {
                  canEscape: true,
                  path: path
                };
              }
            } // 继续前进


            path.push(new Vec2(nextX, nextY));
            currentX = nextX;
            currentY = nextY; // 更新模拟的蠕虫段位置

            for (let i = simulatedSegments.length - 1; i > 0; i--) {
              simulatedSegments[i] = new Vec2(simulatedSegments[i - 1].x, simulatedSegments[i - 1].y);
            }

            simulatedSegments[0] = new Vec2(nextX, nextY); // 防止无限循环

            if (path.length > matrixWidth * matrixHeight) {
              return {
                canEscape: false,
                path: [],
                pathToObstacle: []
              };
            }
          }
        }
        /**
         * 获取蠕虫朝向对应的方向向量
         */


        static getDirectionVector(direction) {
          const dirMap = {
            'up': new Vec2(0, -1),
            'down': new Vec2(0, 1),
            'left': new Vec2(-1, 0),
            'right': new Vec2(1, 0)
          };
          return dirMap[direction] || new Vec2(0, 0);
        }

      });

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=6ead31ab0619a82722057815d57aed75fbf85c93.js.map