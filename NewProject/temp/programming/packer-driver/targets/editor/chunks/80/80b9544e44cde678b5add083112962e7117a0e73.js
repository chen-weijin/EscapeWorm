System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2", "__unresolved_3", "__unresolved_4", "__unresolved_5", "__unresolved_6", "__unresolved_7"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, Node, director, Vec2, Vec3, UITransform, Graphics, Color, Label, Sprite, SpriteFrame, resources, Input, Worm, PathFinder, CollisionDetector, LevelManager, StorageManager, AudioManager, EffectManager, _dec, _dec2, _dec3, _dec4, _dec5, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _crd, ccclass, property, GameController;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }

  function _reportPossibleCrUseOfWorm(extras) {
    _reporterNs.report("Worm", "./entities/Worm", _context.meta, extras);
  }

  function _reportPossibleCrUseOfPathFinder(extras) {
    _reporterNs.report("PathFinder", "./utils/PathFinder", _context.meta, extras);
  }

  function _reportPossibleCrUseOfCollisionDetector(extras) {
    _reporterNs.report("CollisionDetector", "./utils/CollisionDetector", _context.meta, extras);
  }

  function _reportPossibleCrUseOfLevelManager(extras) {
    _reporterNs.report("LevelManager", "./managers/LevelManager", _context.meta, extras);
  }

  function _reportPossibleCrUseOfStorageManager(extras) {
    _reporterNs.report("StorageManager", "./managers/StorageManager", _context.meta, extras);
  }

  function _reportPossibleCrUseOfAudioManager(extras) {
    _reporterNs.report("AudioManager", "./managers/AudioManager", _context.meta, extras);
  }

  function _reportPossibleCrUseOfEffectManager(extras) {
    _reporterNs.report("EffectManager", "./managers/EffectManager", _context.meta, extras);
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
      Vec2 = _cc.Vec2;
      Vec3 = _cc.Vec3;
      UITransform = _cc.UITransform;
      Graphics = _cc.Graphics;
      Color = _cc.Color;
      Label = _cc.Label;
      Sprite = _cc.Sprite;
      SpriteFrame = _cc.SpriteFrame;
      resources = _cc.resources;
      Input = _cc.Input;
    }, function (_unresolved_2) {
      Worm = _unresolved_2.Worm;
    }, function (_unresolved_3) {
      PathFinder = _unresolved_3.PathFinder;
    }, function (_unresolved_4) {
      CollisionDetector = _unresolved_4.CollisionDetector;
    }, function (_unresolved_5) {
      LevelManager = _unresolved_5.LevelManager;
    }, function (_unresolved_6) {
      StorageManager = _unresolved_6.StorageManager;
    }, function (_unresolved_7) {
      AudioManager = _unresolved_7.AudioManager;
    }, function (_unresolved_8) {
      EffectManager = _unresolved_8.EffectManager;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "55b89kOcL5MVZMmTdIYokhP", "GameController", undefined);
      /**
       * 游戏主控制器
       */


      __checkObsolete__(['_decorator', 'Component', 'Node', 'director', 'Vec2', 'Vec3', 'instantiate', 'Prefab', 'UITransform', 'Graphics', 'Color', 'Label', 'Sprite', 'SpriteFrame', 'resources', 'Canvas', 'EventTouch', 'view', 'screen', 'Size', 'input', 'Input']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("GameController", GameController = (_dec = ccclass('GameController'), _dec2 = property(Node), _dec3 = property(Node), _dec4 = property(Label), _dec5 = property([Node]), _dec(_class = (_class2 = class GameController extends Component {
        constructor(...args) {
          super(...args);

          _initializerDefineProperty(this, "gameArea", _descriptor, this);

          _initializerDefineProperty(this, "uiLayer", _descriptor2, this);

          _initializerDefineProperty(this, "levelLabel", _descriptor3, this);

          _initializerDefineProperty(this, "heartNodes", _descriptor4, this);

          _initializerDefineProperty(this, "cellSize", _descriptor5, this);

          // 管理器
          this.levelManager = null;
          this.storageManager = null;
          this.audioManager = null;
          this.effectManager = null;
          // 游戏状态
          this.worms = [];
          this.wormNodes = [];
          this.matrix = null;
          this.escapePoints = [];
          this.failCount = 3;
          this.isGameOver = false;
          this.isVictory = false;
          this.currentLevelId = 1;
          this.isWormsAppearing = false;
          // 渲染相关
          this.offsetX = 0;
          this.offsetY = 0;
          this.graphics = null;
          // 图片资源
          this.wormHeadSprite = null;
          this.wormBodySprite = null;
          this.wormTailSprite = null;
        }

        onLoad() {
          // 初始化管理器
          this.levelManager = this.addComponent(_crd && LevelManager === void 0 ? (_reportPossibleCrUseOfLevelManager({
            error: Error()
          }), LevelManager) : LevelManager);
          this.storageManager = this.addComponent(_crd && StorageManager === void 0 ? (_reportPossibleCrUseOfStorageManager({
            error: Error()
          }), StorageManager) : StorageManager);
          this.audioManager = this.addComponent(_crd && AudioManager === void 0 ? (_reportPossibleCrUseOfAudioManager({
            error: Error()
          }), AudioManager) : AudioManager);
          this.effectManager = this.addComponent(_crd && EffectManager === void 0 ? (_reportPossibleCrUseOfEffectManager({
            error: Error()
          }), EffectManager) : EffectManager);
          this.storageManager.init();
          this.audioManager.init(this.storageManager.getSettings()); // 创建 Graphics 组件用于绘制网格

          if (this.gameArea) {
            this.graphics = this.gameArea.getComponent(Graphics) || this.gameArea.addComponent(Graphics);
          } // 注册触摸事件


          if (this.gameArea) {
            this.gameArea.on(Input.EventType.TOUCH_END, this.onTouchEnd, this);
          } // 加载蠕虫图片资源


          this.loadWormImages();
        }
        /**
         * 加载蠕虫图片资源
         */


        async loadWormImages() {
          try {
            this.wormHeadSprite = await this.loadSpriteFrame('images/worm_head');
            this.wormBodySprite = await this.loadSpriteFrame('images/worm_body');
            this.wormTailSprite = await this.loadSpriteFrame('images/worm_tail');
          } catch (e) {
            console.warn('蠕虫图片资源加载失败，将使用默认绘制方式');
          }
        }
        /**
         * 加载 SpriteFrame
         */


        loadSpriteFrame(path) {
          return new Promise((resolve, reject) => {
            resources.load(path + '/spriteFrame', SpriteFrame, (err, spriteFrame) => {
              if (err) {
                reject(err);
              } else {
                resolve(spriteFrame);
              }
            });
          });
        }
        /**
         * 初始化游戏关卡
         */


        async initLevel(levelId) {
          this.currentLevelId = levelId;
          this.failCount = 3;
          this.isGameOver = false;
          this.isVictory = false;
          this.worms = [];
          this.wormNodes.forEach(n => n.destroy());
          this.wormNodes = [];
          this.escapePoints = []; // 更新 UI

          this.updateUI();

          try {
            // 加载关卡数据
            const levelData = await this.levelManager.loadLevel(levelId);
            this.matrix = levelData.matrix;
            this.escapePoints = levelData.escapePoints.map(p => new Vec2(p.x, p.y)); // 计算渲染参数

            this.calculateRenderParams(); // 创建蠕虫对象

            for (const wormConfig of levelData.worms) {
              const wormNode = new Node(`Worm_${wormConfig.id}`);
              wormNode.parent = this.gameArea;
              const worm = wormNode.addComponent(_crd && Worm === void 0 ? (_reportPossibleCrUseOfWorm({
                error: Error()
              }), Worm) : Worm);
              worm.init(wormConfig);
              worm.setVisibleSegmentCount(0);
              this.worms.push(worm);
              this.wormNodes.push(wormNode);
            } // 绘制网格


            this.drawGrid(); // 逐个显示蠕虫

            await this.animateWormsAppearance();
          } catch (error) {
            console.error('初始化游戏场景失败:', error);
            throw error;
          }
        }
        /**
         * 计算渲染参数
         */


        calculateRenderParams() {
          if (!this.matrix || !this.gameArea) return;
          const transform = this.gameArea.getComponent(UITransform);
          if (!transform) return;
          const areaWidth = transform.width;
          const areaHeight = transform.height; // 计算合适的 cellSize

          const cellSizeX = areaWidth / this.matrix.width;
          const cellSizeY = areaHeight / this.matrix.height;
          this.cellSize = Math.min(cellSizeX, cellSizeY) * 0.9; // 计算偏移量使网格居中

          const gridWidth = this.matrix.width * this.cellSize;
          const gridHeight = this.matrix.height * this.cellSize;
          this.offsetX = (areaWidth - gridWidth) / 2 - areaWidth / 2;
          this.offsetY = (areaHeight - gridHeight) / 2 - areaHeight / 2;
        }
        /**
         * 绘制网格
         */


        drawGrid() {
          if (!this.graphics || !this.matrix) return;
          this.graphics.clear();
          this.graphics.strokeColor = new Color(224, 224, 224, 255);
          this.graphics.lineWidth = 1; // 绘制垂直网格线

          for (let x = 0; x <= this.matrix.width; x++) {
            const screenX = this.offsetX + x * this.cellSize;
            this.graphics.moveTo(screenX, this.offsetY);
            this.graphics.lineTo(screenX, this.offsetY + this.matrix.height * this.cellSize);
          } // 绘制水平网格线


          for (let y = 0; y <= this.matrix.height; y++) {
            const screenY = this.offsetY + y * this.cellSize;
            this.graphics.moveTo(this.offsetX, screenY);
            this.graphics.lineTo(this.offsetX + this.matrix.width * this.cellSize, screenY);
          }

          this.graphics.stroke();
        }
        /**
         * 世界坐标转屏幕坐标
         */


        worldToScreen(x, y) {
          return new Vec3(this.offsetX + (x + 0.5) * this.cellSize, -(this.offsetY + (y + 0.5) * this.cellSize), 0);
        }
        /**
         * 屏幕坐标转世界坐标
         */


        screenToWorld(screenX, screenY) {
          const x = Math.floor((screenX - this.offsetX) / this.cellSize);
          const y = Math.floor((-screenY - this.offsetY) / this.cellSize);
          return new Vec2(x, y);
        }
        /**
         * 动画显示蠕虫
         */


        async animateWormsAppearance() {
          this.isWormsAppearing = true;
          const segmentInterval = 50;
          let maxSegments = 0;

          for (const worm of this.worms) {
            maxSegments = Math.max(maxSegments, worm.segments.length);
          }

          for (let segmentIndex = 1; segmentIndex <= maxSegments; segmentIndex++) {
            for (const worm of this.worms) {
              if (segmentIndex <= worm.segments.length) {
                worm.setVisibleSegmentCount(segmentIndex);
              }
            }

            this.updateWormVisuals();
            await this.wait(segmentInterval);
          }

          for (const worm of this.worms) {
            worm.setVisibleSegmentCount(worm.segments.length);
          }

          this.isWormsAppearing = false;
        }
        /**
         * 更新蠕虫可视化
         */


        update(dt) {
          if (this.worms.length > 0) {
            this.updateWormVisuals();
          }
        }
        /**
         * 更新蠕虫可视化
         */


        updateWormVisuals() {
          for (let i = 0; i < this.worms.length; i++) {
            const worm = this.worms[i];
            const wormNode = this.wormNodes[i];

            if (worm.hasEscaped()) {
              wormNode.active = false;
              continue;
            }

            wormNode.active = true; // 获取插值后的段位置

            const segments = worm.getInterpolatedSegments();
            const visibleCount = worm.visibleSegmentCount; // 更新每个段的位置

            this.renderWormSegments(wormNode, worm, segments, visibleCount);
          }
        }
        /**
         * 渲染蠕虫段
         */


        renderWormSegments(wormNode, worm, segments, visibleCount) {
          // 确保有足够的子节点
          while (wormNode.children.length < segments.length) {
            const segmentNode = new Node(`Segment_${wormNode.children.length}`);
            segmentNode.parent = wormNode; // 添加 Graphics 组件用于绘制

            const graphics = segmentNode.addComponent(Graphics);
            segmentNode.addComponent(UITransform);
          } // 更新每个段


          for (let i = 0; i < segments.length; i++) {
            const segmentNode = wormNode.children[i];
            const isVisible = i >= segments.length - visibleCount;
            segmentNode.active = isVisible;
            if (!isVisible) continue;
            const segment = segments[i];
            const screenPos = this.worldToScreen(segment.x, segment.y);
            segmentNode.setPosition(screenPos); // 绘制段

            const graphics = segmentNode.getComponent(Graphics);

            if (graphics) {
              graphics.clear();
              const radius = this.cellSize * 0.4;
              const color = this.hexToColor(worm.color);

              if (worm.isHighlighted) {
                graphics.fillColor = new Color(255, 100, 100, 255);
              } else {
                graphics.fillColor = color;
              }

              graphics.circle(0, 0, radius);
              graphics.fill(); // 绘制眼睛（头部）

              if (i === 0) {
                this.drawEyes(graphics, worm.direction, radius);
              }
            }
          } // 隐藏多余的节点


          for (let i = segments.length; i < wormNode.children.length; i++) {
            wormNode.children[i].active = false;
          }
        }
        /**
         * 绘制眼睛
         */


        drawEyes(graphics, direction, radius) {
          graphics.fillColor = new Color(255, 255, 255, 255);
          const eyeSize = radius * 0.35;
          const eyeOffset = radius * 0.35;
          let eyeX1, eyeY1, eyeX2, eyeY2;

          switch (direction) {
            case 'left':
              eyeX1 = -eyeOffset;
              eyeY1 = -eyeOffset;
              eyeX2 = -eyeOffset;
              eyeY2 = eyeOffset;
              break;

            case 'right':
              eyeX1 = eyeOffset;
              eyeY1 = -eyeOffset;
              eyeX2 = eyeOffset;
              eyeY2 = eyeOffset;
              break;

            case 'up':
              eyeX1 = -eyeOffset;
              eyeY1 = eyeOffset;
              eyeX2 = eyeOffset;
              eyeY2 = eyeOffset;
              break;

            case 'down':
            default:
              eyeX1 = -eyeOffset;
              eyeY1 = -eyeOffset;
              eyeX2 = eyeOffset;
              eyeY2 = -eyeOffset;
              break;
          } // 白色眼睛


          graphics.circle(eyeX1, eyeY1, eyeSize);
          graphics.fill();
          graphics.circle(eyeX2, eyeY2, eyeSize);
          graphics.fill(); // 黑色眼珠

          graphics.fillColor = new Color(0, 0, 0, 255);
          const pupilSize = eyeSize * 0.5;
          graphics.circle(eyeX1, eyeY1, pupilSize);
          graphics.fill();
          graphics.circle(eyeX2, eyeY2, pupilSize);
          graphics.fill();
        }
        /**
         * 处理触摸事件
         */


        onTouchEnd(event) {
          var _this$gameArea;

          if (this.isGameOver || this.isVictory || this.isWormsAppearing) {
            return;
          }

          const location = event.getUILocation();
          const transform = (_this$gameArea = this.gameArea) == null ? void 0 : _this$gameArea.getComponent(UITransform);
          if (!transform) return; // 转换为节点本地坐标

          const localPos = transform.convertToNodeSpaceAR(new Vec3(location.x, location.y, 0)); // 查找点击的蠕虫

          const clickedWorm = this.findWormAtPosition(localPos.x, -localPos.y);

          if (clickedWorm && !clickedWorm.hasEscaped() && !clickedWorm.isAnimating) {
            this.handleWormClick(clickedWorm);
          }
        }
        /**
         * 查找点击位置的蠕虫
         */


        findWormAtPosition(screenX, screenY) {
          const clickRadius = this.cellSize * 0.6;

          for (const worm of this.worms) {
            if (worm.hasEscaped()) continue;

            for (const segment of worm.getAllSegments()) {
              const segmentScreenPos = this.worldToScreen(segment.x, segment.y);
              const dx = screenX - segmentScreenPos.x;
              const dy = screenY + segmentScreenPos.y;
              const distance = Math.sqrt(dx * dx + dy * dy);

              if (distance <= clickRadius) {
                return worm;
              }
            }
          }

          return null;
        }
        /**
         * 处理蠕虫点击
         */


        async handleWormClick(worm) {
          var _this$audioManager;

          (_this$audioManager = this.audioManager) == null ? void 0 : _this$audioManager.playSound('click'); // 获取障碍物

          const obstacles = this.getObstacles(worm); // 查找逃脱路径

          const result = (_crd && PathFinder === void 0 ? (_reportPossibleCrUseOfPathFinder({
            error: Error()
          }), PathFinder) : PathFinder).findPath(worm.getHeadPosition(), worm.direction, worm.getLength(), worm.getAllSegments(), this.matrix.width, this.matrix.height, obstacles, this.escapePoints);

          if (result.canEscape && result.path.length > 0) {
            await this.moveWormToEscape(worm, result.path);
          } else if (!result.canEscape && result.pathToObstacle) {
            await this.moveWormToObstacleAndBack(worm, result.pathToObstacle);
          } else {
            await this.tryMoveWormOneStep(worm);
          }
        }
        /**
         * 获取障碍物
         */


        getObstacles(excludeWorm) {
          const obstacles = [];

          for (const worm of this.worms) {
            if (worm.id === excludeWorm.id || worm.hasEscaped() || worm.isEscaping || worm.isAnimating) {
              continue;
            }

            obstacles.push(...worm.getAllSegments());
          }

          return obstacles;
        }
        /**
         * 移动蠕虫逃脱
         */


        async moveWormToEscape(worm, path) {
          var _this$audioManager3, _this$effectManager;

          worm.isEscaping = true;
          const moveDuration = 80;

          for (const nextPos of path) {
            var _this$audioManager2;

            // 检查碰撞
            const wormLikeArray = this.worms.map(w => ({
              id: w.id,
              segments: w.segments,
              direction: w.direction,
              isEscaped: w.isEscaped,
              isEscaping: w.isEscaping,
              isAnimating: w.isAnimating
            }));

            if ((_crd && CollisionDetector === void 0 ? (_reportPossibleCrUseOfCollisionDetector({
              error: Error()
            }), CollisionDetector) : CollisionDetector).checkCollision({
              id: worm.id,
              segments: worm.segments,
              direction: worm.direction,
              isEscaped: worm.isEscaped,
              isEscaping: worm.isEscaping,
              isAnimating: worm.isAnimating
            }, nextPos, wormLikeArray)) {
              await this.handleCollision(worm);
              return;
            }

            await worm.startMoveAnimation(nextPos, moveDuration);
            (_this$audioManager2 = this.audioManager) == null ? void 0 : _this$audioManager2.playSound('move');
          } // 标记为逃脱


          worm.isEscaping = false;
          worm.markEscaped();
          (_this$audioManager3 = this.audioManager) == null ? void 0 : _this$audioManager3.playSound('escape');
          (_this$effectManager = this.effectManager) == null ? void 0 : _this$effectManager.createEscapeEffect(this.worldToScreen(worm.getHeadPosition().x, worm.getHeadPosition().y), worm.color);
          this.checkVictory();
        }
        /**
         * 移动蠕虫到障碍物并返回
         */


        async moveWormToObstacleAndBack(worm, pathToObstacle) {
          var _this$audioManager4;

          const originalSegments = worm.segments.map(s => new Vec2(s.x, s.y));
          const moveDuration = 60;
          const direction = (_crd && PathFinder === void 0 ? (_reportPossibleCrUseOfPathFinder({
            error: Error()
          }), PathFinder) : PathFinder).getDirectionVector(worm.direction); // 移动到障碍物位置

          for (const pos of pathToObstacle) {
            await worm.startMoveAnimation(pos, moveDuration);
          } // 再移动一步到障碍物


          const lastPos = pathToObstacle.length > 0 ? pathToObstacle[pathToObstacle.length - 1] : worm.getHeadPosition();
          const obstaclePos = new Vec2(lastPos.x + direction.x, lastPos.y + direction.y);
          await worm.startMoveAnimation(obstaclePos, moveDuration);
          (_this$audioManager4 = this.audioManager) == null ? void 0 : _this$audioManager4.playSound('collision'); // 高亮闪烁

          await this.flashWorm(worm); // 返回原位

          worm.reset();
          this.failCount--;
          this.updateUI();

          if (this.failCount <= 0) {
            this.gameOver();
          }
        }
        /**
         * 尝试移动蠕虫一步
         */


        async tryMoveWormOneStep(worm) {
          const headPos = worm.getHeadPosition();
          const direction = (_crd && PathFinder === void 0 ? (_reportPossibleCrUseOfPathFinder({
            error: Error()
          }), PathFinder) : PathFinder).getDirectionVector(worm.direction);
          const nextPos = new Vec2(headPos.x + direction.x, headPos.y + direction.y); // 检查边界

          if (!(_crd && CollisionDetector === void 0 ? (_reportPossibleCrUseOfCollisionDetector({
            error: Error()
          }), CollisionDetector) : CollisionDetector).isInBounds(nextPos, this.matrix.width, this.matrix.height)) {
            var _this$audioManager5;

            // 可以逃脱
            await worm.startMoveAnimation(nextPos, 80);
            worm.markEscaped();
            (_this$audioManager5 = this.audioManager) == null ? void 0 : _this$audioManager5.playSound('escape');
            this.checkVictory();
            return;
          } // 检查碰撞


          const wormLikeArray = this.worms.map(w => ({
            id: w.id,
            segments: w.segments,
            direction: w.direction,
            isEscaped: w.isEscaped,
            isEscaping: w.isEscaping,
            isAnimating: w.isAnimating
          }));

          if ((_crd && CollisionDetector === void 0 ? (_reportPossibleCrUseOfCollisionDetector({
            error: Error()
          }), CollisionDetector) : CollisionDetector).checkCollision({
            id: worm.id,
            segments: worm.segments,
            direction: worm.direction,
            isEscaped: worm.isEscaped,
            isEscaping: worm.isEscaping,
            isAnimating: worm.isAnimating
          }, nextPos, wormLikeArray)) {
            await this.handleCollision(worm);
          }
        }
        /**
         * 处理碰撞
         */


        async handleCollision(worm) {
          var _this$audioManager6;

          (_this$audioManager6 = this.audioManager) == null ? void 0 : _this$audioManager6.playSound('collision');
          await this.flashWorm(worm);
          worm.reset();
          worm.isEscaping = false;
          this.failCount--;
          this.updateUI();

          if (this.failCount <= 0) {
            this.gameOver();
          }
        }
        /**
         * 蠕虫闪烁效果
         */


        async flashWorm(worm) {
          for (let i = 0; i < 6; i++) {
            worm.setHighlighted(i % 2 === 0);
            await this.wait(100);
          }

          worm.setHighlighted(false);
        }
        /**
         * 检查胜利
         */


        checkVictory() {
          if (this.worms.every(worm => worm.hasEscaped())) {
            this.victory();
          }
        }
        /**
         * 胜利处理
         */


        victory() {
          var _this$audioManager7, _this$storageManager;

          this.isVictory = true;
          this.isGameOver = true;
          (_this$audioManager7 = this.audioManager) == null ? void 0 : _this$audioManager7.playSound('victory');
          (_this$storageManager = this.storageManager) == null ? void 0 : _this$storageManager.completeLevel(this.currentLevelId); // 显示胜利 UI

          this.scheduleOnce(() => {
            this.showResult(true);
          }, 2);
        }
        /**
         * 游戏失败处理
         */


        gameOver() {
          var _this$audioManager8;

          this.isGameOver = true;
          (_this$audioManager8 = this.audioManager) == null ? void 0 : _this$audioManager8.playSound('fail');
          this.scheduleOnce(() => {
            this.showResult(false);
          }, 1);
        }
        /**
         * 显示结果
         */


        showResult(isVictory) {
          // 这里可以切换到结果场景或显示结果 UI
          console.log(isVictory ? '胜利！' : '失败！'); // director.loadScene('ResultScene');
        }
        /**
         * 更新 UI
         */


        updateUI() {
          if (this.levelLabel) {
            this.levelLabel.string = `关卡 ${this.currentLevelId}`;
          } // 更新红心


          for (let i = 0; i < this.heartNodes.length; i++) {
            if (this.heartNodes[i]) {
              const sprite = this.heartNodes[i].getComponent(Sprite);

              if (sprite) {
                sprite.color = i < this.failCount ? new Color(244, 67, 54, 255) : new Color(200, 200, 200, 255);
              }
            }
          }
        }
        /**
         * 等待指定时间
         */


        wait(ms) {
          return new Promise(resolve => setTimeout(resolve, ms));
        }
        /**
         * 十六进制颜色转 Color
         */


        hexToColor(hex) {
          const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

          if (result) {
            return new Color(parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16), 255);
          }

          return new Color(255, 255, 255, 255);
        }
        /**
         * 重新开始当前关卡
         */


        restartLevel() {
          this.initLevel(this.currentLevelId);
        }
        /**
         * 返回主菜单
         */


        returnToMenu() {
          director.loadScene('LaunchScene');
        }
        /**
         * 进入下一关
         */


        nextLevel() {
          var _this$storageManager2;

          const nextLevelId = this.currentLevelId + 1;

          if ((_this$storageManager2 = this.storageManager) != null && _this$storageManager2.isLevelUnlocked(nextLevelId)) {
            this.initLevel(nextLevelId);
          } else {
            this.returnToMenu();
          }
        }

      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "gameArea", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "uiLayer", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "levelLabel", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "heartNodes", [_dec5], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return [];
        }
      }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "cellSize", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 60;
        }
      })), _class2)) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=80b9544e44cde678b5add083112962e7117a0e73.js.map