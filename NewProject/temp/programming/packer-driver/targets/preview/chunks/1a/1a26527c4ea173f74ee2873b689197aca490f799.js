System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2", "__unresolved_3", "__unresolved_4", "__unresolved_5", "__unresolved_6", "__unresolved_7"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, Node, director, Vec2, Vec3, UITransform, Graphics, Color, Label, Sprite, SpriteFrame, resources, Input, Worm, PathFinder, CollisionDetector, LevelManager, StorageManager, AudioManager, EffectManager, _dec, _dec2, _dec3, _dec4, _dec5, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _crd, ccclass, property, GameController;

  function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

  function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

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
        constructor() {
          super(...arguments);

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
          this.isInitialized = false;
          // 渲染相关
          this.offsetX = 0;
          this.offsetY = 0;
          this.graphics = null;
          // 图片资源
          this.wormHeadSprite = null;
          this.wormBodySprite = null;
          this.wormTailSprite = null;
          this.gameAreaSetup = false;
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
          this.audioManager.init(this.storageManager.getSettings()); // 加载蠕虫图片资源

          this.loadWormImages();
        }

        /**
         * 设置游戏区域并注册事件（在 gameArea 被外部设置后调用）
         */
        setupGameArea() {
          if (!this.gameArea || this.gameAreaSetup) return; // 确保 UITransform 存在且有足够的尺寸

          var uiTransform = this.gameArea.getComponent(UITransform);

          if (!uiTransform) {
            uiTransform = this.gameArea.addComponent(UITransform);
          } // 如果尺寸为 0，设置默认尺寸


          if (uiTransform.width === 0 || uiTransform.height === 0) {
            var _this$gameArea$parent;

            // 尝试从父节点获取尺寸
            var parentTransform = (_this$gameArea$parent = this.gameArea.parent) == null ? void 0 : _this$gameArea$parent.getComponent(UITransform);

            if (parentTransform && parentTransform.width > 0 && parentTransform.height > 0) {
              uiTransform.width = parentTransform.width;
              uiTransform.height = parentTransform.height;
            } else {
              // 使用默认尺寸
              uiTransform.width = 720;
              uiTransform.height = 1280;
            }

            console.log('设置 gameArea 默认尺寸:', uiTransform.width, 'x', uiTransform.height);
          } // 创建 Graphics 组件用于绘制网格


          this.graphics = this.gameArea.getComponent(Graphics);

          if (!this.graphics) {
            this.graphics = this.gameArea.addComponent(Graphics);
          } // 注册触摸事件


          this.gameArea.on(Input.EventType.TOUCH_END, this.onTouchEnd, this);
          console.log('触摸事件已注册到 gameArea, size=', uiTransform.width, 'x', uiTransform.height);
          this.gameAreaSetup = true;
        }
        /**
         * 加载蠕虫图片资源
         */


        loadWormImages() {
          var _this = this;

          return _asyncToGenerator(function* () {
            try {
              _this.wormHeadSprite = yield _this.loadSpriteFrame('images/worm_head');
              _this.wormBodySprite = yield _this.loadSpriteFrame('images/worm_body');
              _this.wormTailSprite = yield _this.loadSpriteFrame('images/worm_tail');
            } catch (e) {
              console.warn('蠕虫图片资源加载失败，将使用默认绘制方式');
            }
          })();
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


        initLevel(levelId) {
          var _this2 = this;

          return _asyncToGenerator(function* () {
            // 暂停更新，防止在初始化过程中触发渲染
            _this2.isInitialized = false; // 设置游戏区域（注册触摸事件）

            _this2.setupGameArea();

            _this2.currentLevelId = levelId;
            _this2.failCount = 3;
            _this2.isGameOver = false;
            _this2.isVictory = false;
            _this2.worms = [];

            _this2.wormNodes.forEach(n => n.destroy());

            _this2.wormNodes = [];
            _this2.escapePoints = []; // 更新 UI

            _this2.updateUI();

            try {
              // 加载关卡数据
              var levelData = yield _this2.levelManager.loadLevel(levelId);
              _this2.matrix = levelData.matrix;
              _this2.escapePoints = levelData.escapePoints.map(p => new Vec2(p.x, p.y)); // 计算渲染参数

              _this2.calculateRenderParams(); // 创建蠕虫对象


              for (var wormConfig of levelData.worms) {
                var wormNode = new Node("Worm_" + wormConfig.id);
                wormNode.parent = _this2.gameArea;
                var worm = wormNode.addComponent(_crd && Worm === void 0 ? (_reportPossibleCrUseOfWorm({
                  error: Error()
                }), Worm) : Worm);
                worm.init(wormConfig);
                worm.setVisibleSegmentCount(0);

                _this2.worms.push(worm);

                _this2.wormNodes.push(wormNode);

                console.log("\u8815\u866B " + worm.id + " \u521B\u5EFA: \u5934\u90E8=(" + worm.getHeadPosition().x + ", " + worm.getHeadPosition().y + "), \u65B9\u5411=" + worm.direction + ", \u6BB5\u6570=" + worm.segments.length);
              } // 绘制网格


              _this2.drawGrid(); // 逐个显示蠕虫


              yield _this2.animateWormsAppearance(); // 初始化完成

              _this2.isInitialized = true;
            } catch (error) {
              console.error('初始化游戏场景失败:', error);
              throw error;
            }
          })();
        }
        /**
         * 计算渲染参数
         */


        calculateRenderParams() {
          if (!this.matrix || !this.gameArea) return;
          var transform = this.gameArea.getComponent(UITransform);
          if (!transform) return;
          var areaWidth = transform.width;
          var areaHeight = transform.height; // 计算合适的 cellSize

          var cellSizeX = areaWidth / this.matrix.width;
          var cellSizeY = areaHeight / this.matrix.height;
          this.cellSize = Math.min(cellSizeX, cellSizeY) * 0.9; // 计算偏移量使网格居中

          var gridWidth = this.matrix.width * this.cellSize;
          var gridHeight = this.matrix.height * this.cellSize;
          this.offsetX = (areaWidth - gridWidth) / 2 - areaWidth / 2;
          this.offsetY = (areaHeight - gridHeight) / 2 - areaHeight / 2;
          console.log('渲染参数: areaSize=', areaWidth, 'x', areaHeight, ' cellSize=', this.cellSize, ' offset=', this.offsetX, this.offsetY);
        }
        /**
         * 绘制网格
         */


        drawGrid() {
          if (!this.graphics || !this.matrix) return;
          this.graphics.clear();
          this.graphics.strokeColor = new Color(224, 224, 224, 255);
          this.graphics.lineWidth = 1; // 绘制垂直网格线

          for (var x = 0; x <= this.matrix.width; x++) {
            var screenX = this.offsetX + x * this.cellSize;
            this.graphics.moveTo(screenX, this.offsetY);
            this.graphics.lineTo(screenX, this.offsetY + this.matrix.height * this.cellSize);
          } // 绘制水平网格线


          for (var y = 0; y <= this.matrix.height; y++) {
            var screenY = this.offsetY + y * this.cellSize;
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
          var x = Math.floor((screenX - this.offsetX) / this.cellSize);
          var y = Math.floor((-screenY - this.offsetY) / this.cellSize);
          return new Vec2(x, y);
        }
        /**
         * 动画显示蠕虫
         */


        animateWormsAppearance() {
          var _this3 = this;

          return _asyncToGenerator(function* () {
            _this3.isWormsAppearing = true;
            var segmentInterval = 50;
            var maxSegments = 0;

            for (var worm of _this3.worms) {
              maxSegments = Math.max(maxSegments, worm.segments.length);
            }

            for (var segmentIndex = 1; segmentIndex <= maxSegments; segmentIndex++) {
              for (var _worm of _this3.worms) {
                if (segmentIndex <= _worm.segments.length) {
                  _worm.setVisibleSegmentCount(segmentIndex);
                }
              }

              _this3.updateWormVisuals();

              yield _this3.wait(segmentInterval);
            }

            for (var _worm2 of _this3.worms) {
              _worm2.setVisibleSegmentCount(_worm2.segments.length);
            }

            _this3.isWormsAppearing = false;
          })();
        }
        /**
         * 更新蠕虫可视化
         */


        update(dt) {
          if (this.isInitialized && this.worms.length > 0) {
            this.updateWormVisuals();
          }
        }
        /**
         * 更新蠕虫可视化
         */


        updateWormVisuals() {
          for (var i = 0; i < this.worms.length; i++) {
            var worm = this.worms[i];
            var wormNode = this.wormNodes[i];

            if (worm.hasEscaped()) {
              wormNode.active = false;
              continue;
            } // 确保蠕虫节点是激活的


            if (!wormNode.active) {
              console.log("\u6FC0\u6D3B\u8815\u866B\u8282\u70B9 " + worm.id);
              wormNode.active = true;
            } // 获取插值后的段位置


            var segments = worm.getInterpolatedSegments();
            var visibleCount = worm.visibleSegmentCount; // 调试：检查段数据

            if (segments.length === 0) {
              console.error("\u9519\u8BEF\uFF1A\u8815\u866B " + worm.id + " \u7684 segments \u4E3A\u7A7A\uFF01");
              continue;
            }

            if (visibleCount === 0 && !worm.hasEscaped()) {
              console.warn("\u8B66\u544A\uFF1A\u8815\u866B " + worm.id + " \u7684 visibleCount=0\uFF0C\u4F46\u672A\u9003\u8131\uFF01");
            } // 更新每个段的位置


            this.renderWormSegments(wormNode, worm, segments, visibleCount);
          }
        }
        /**
         * 调试：打印渲染状态
         */


        logRenderState(worm) {
          var segments = worm.getInterpolatedSegments();
          var head = segments[0];
          var screenPos = this.worldToScreen(head.x, head.y);
          console.log("\u6E32\u67D3\u8815\u866B " + worm.id + ": segments=" + segments.length + ", visible=" + worm.visibleSegmentCount + ", head=(" + head.x + ", " + head.y + "), screen=(" + screenPos.x.toFixed(0) + ", " + screenPos.y.toFixed(0) + "), animating=" + worm.isAnimating + ", cellSize=" + this.cellSize.toFixed(1) + ", offset=(" + this.offsetX.toFixed(0) + ", " + this.offsetY.toFixed(0) + ")");
        }
        /**
         * 调试：打印蠕虫状态
         */


        debugWormState() {
          console.log('=== 蠕虫状态 ===');

          for (var worm of this.worms) {
            console.log("\u8815\u866B " + worm.id + ": escaped=" + worm.isEscaped + ", escaping=" + worm.isEscaping + ", animating=" + worm.isAnimating + ", segments=" + worm.segments.length + ", visible=" + worm.visibleSegmentCount);
          }
        }
        /**
         * 渲染蠕虫段
         */


        renderWormSegments(wormNode, worm, segments, visibleCount) {
          // 确保有足够的子节点
          var currentCount = wormNode.children.length;

          for (var idx = currentCount; idx < segments.length; idx++) {
            var segmentNode = new Node("Segment_" + idx); // 先添加 UITransform

            var transform = segmentNode.addComponent(UITransform); // 再添加 Graphics 组件用于绘制

            var graphics = segmentNode.addComponent(Graphics); // 最后设置 parent，避免在设置 parent 时触发额外逻辑

            segmentNode.parent = wormNode;
          } // 更新每个段


          for (var i = 0; i < segments.length; i++) {
            var _segmentNode = wormNode.children[i];
            var isVisible = i >= segments.length - visibleCount;
            _segmentNode.active = isVisible; // 调试：如果蠕虫应该可见但被隐藏了

            if (i === 0 && !isVisible && !worm.hasEscaped()) {
              console.warn("\u8B66\u544A\uFF1A\u8815\u866B " + worm.id + " \u5934\u90E8\u88AB\u9690\u85CF\uFF01segments.length=" + segments.length + ", visibleCount=" + visibleCount + ", isVisible=" + isVisible);
            }

            if (!isVisible) continue;
            var segment = segments[i];
            var screenPos = this.worldToScreen(segment.x, segment.y);

            _segmentNode.setPosition(screenPos); // 调试：检查坐标是否在合理范围内


            if (i === 0) {
              var _this$gameArea;

              var _transform = (_this$gameArea = this.gameArea) == null ? void 0 : _this$gameArea.getComponent(UITransform);

              if (_transform) {
                var halfWidth = _transform.width / 2;
                var halfHeight = _transform.height / 2;

                if (Math.abs(screenPos.x) > halfWidth * 2 || Math.abs(screenPos.y) > halfHeight * 2) {
                  console.warn("\u8B66\u544A\uFF1A\u8815\u866B " + worm.id + " \u5934\u90E8\u5750\u6807\u8D85\u51FA\u5C4F\u5E55\u8303\u56F4\uFF01world=(" + segment.x + ", " + segment.y + ") screen=(" + screenPos.x.toFixed(0) + ", " + screenPos.y.toFixed(0) + "), \u5C4F\u5E55\u8303\u56F4=(" + halfWidth + ", " + halfHeight + ")");
                }
              }
            } // 绘制段


            var _graphics = _segmentNode.getComponent(Graphics);

            if (_graphics) {
              _graphics.clear();

              var radius = this.cellSize * 0.4;
              var color = this.hexToColor(worm.color);

              if (worm.isHighlighted) {
                _graphics.fillColor = new Color(255, 100, 100, 255);
              } else {
                _graphics.fillColor = color;
              }

              _graphics.circle(0, 0, radius);

              _graphics.fill(); // 绘制眼睛（头部）


              if (i === 0) {
                this.drawEyes(_graphics, worm.direction, radius);
              }
            }
          } // 隐藏多余的节点


          for (var _i = segments.length; _i < wormNode.children.length; _i++) {
            wormNode.children[_i].active = false;
          }
        }
        /**
         * 绘制眼睛
         */


        drawEyes(graphics, direction, radius) {
          graphics.fillColor = new Color(255, 255, 255, 255);
          var eyeSize = radius * 0.35;
          var eyeOffset = radius * 0.35;
          var eyeX1, eyeY1, eyeX2, eyeY2;

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
          var pupilSize = eyeSize * 0.5;
          graphics.circle(eyeX1, eyeY1, pupilSize);
          graphics.fill();
          graphics.circle(eyeX2, eyeY2, pupilSize);
          graphics.fill();
        }
        /**
         * 处理触摸事件
         */


        onTouchEnd(event) {
          var _this$gameArea2;

          if (this.isGameOver || this.isVictory || this.isWormsAppearing) {
            console.log('触摸被忽略: isGameOver=', this.isGameOver, 'isVictory=', this.isVictory, 'isWormsAppearing=', this.isWormsAppearing);
            return;
          }

          var location = event.getUILocation();
          var transform = (_this$gameArea2 = this.gameArea) == null ? void 0 : _this$gameArea2.getComponent(UITransform);

          if (!transform) {
            console.log('transform 不存在');
            return;
          } // 转换为节点本地坐标


          var localPos = transform.convertToNodeSpaceAR(new Vec3(location.x, location.y, 0));
          console.log('触摸位置: UI=', location.x, location.y, ' Local=', localPos.x, localPos.y); // 查找点击的蠕虫

          var clickedWorm = this.findWormAtPosition(localPos.x, localPos.y);

          if (clickedWorm) {
            console.log('找到蠕虫:', clickedWorm.id, 'escaped=', clickedWorm.hasEscaped(), 'animating=', clickedWorm.isAnimating);

            if (!clickedWorm.hasEscaped() && !clickedWorm.isAnimating) {
              this.handleWormClick(clickedWorm);
            }
          } else {
            console.log('没有找到蠕虫');
          }
        }
        /**
         * 查找点击位置的蠕虫
         */


        findWormAtPosition(localX, localY) {
          var clickRadius = this.cellSize * 0.6;

          for (var worm of this.worms) {
            if (worm.hasEscaped()) continue;

            for (var segment of worm.getAllSegments()) {
              // 计算蠕虫段在本地坐标系中的位置
              var segmentLocalX = this.offsetX + (segment.x + 0.5) * this.cellSize;
              var segmentLocalY = -(this.offsetY + (segment.y + 0.5) * this.cellSize);
              var dx = localX - segmentLocalX;
              var dy = localY - segmentLocalY;
              var distance = Math.sqrt(dx * dx + dy * dy);

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


        handleWormClick(worm) {
          var _this4 = this;

          return _asyncToGenerator(function* () {
            var _this4$audioManager;

            console.log('处理蠕虫点击: id=', worm.id, ' head=', worm.getHeadPosition(), ' dir=', worm.direction);
            (_this4$audioManager = _this4.audioManager) == null ? void 0 : _this4$audioManager.playSound('click'); // 获取障碍物

            var obstacles = _this4.getObstacles(worm);

            console.log('障碍物数量:', obstacles.length); // 查找逃脱路径

            var result = (_crd && PathFinder === void 0 ? (_reportPossibleCrUseOfPathFinder({
              error: Error()
            }), PathFinder) : PathFinder).findPath(worm.getHeadPosition(), worm.direction, worm.getLength(), worm.getAllSegments(), _this4.matrix.width, _this4.matrix.height, obstacles, _this4.escapePoints);
            console.log('路径查找结果: canEscape=', result.canEscape, ' pathLen=', result.path.length);

            try {
              if (result.canEscape && result.path.length > 0) {
                console.log('蠕虫开始逃脱');
                yield _this4.moveWormToEscape(worm, result.path);
                console.log('蠕虫逃脱流程完成');
              } else if (!result.canEscape && result.pathToObstacle && result.pathToObstacle.length > 0) {
                console.log('蠕虫碰到障碍物，后退');
                yield _this4.moveWormToObstacleAndBack(worm, result.pathToObstacle);
                console.log('蠕虫后退流程完成');
              } else {
                console.log('尝试向前移动一步');
                yield _this4.tryMoveWormOneStep(worm);
                console.log('移动一步流程完成');
              }
            } catch (error) {
              console.error('处理蠕虫移动时发生错误:', error);
              console.error('错误堆栈:', error.stack);
            }
          })();
        }
        /**
         * 获取障碍物
         */


        getObstacles(excludeWorm) {
          var obstacles = [];

          for (var worm of this.worms) {
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


        moveWormToEscape(worm, path) {
          var _this5 = this;

          return _asyncToGenerator(function* () {
            try {
              console.log("\u8815\u866B " + worm.id + " \u5F00\u59CB\u9003\u8131\uFF0C\u8DEF\u5F84\u957F\u5EA6=" + path.length);
              worm.isEscaping = true;
              var moveDuration = 80;

              var _loop = function* _loop() {
                var _this5$audioManager4;

                var nextPos = path[stepIndex];
                console.log("\u8815\u866B " + worm.id + " \u6B65\u9AA4 " + (stepIndex + 1) + "/" + path.length + ": \u79FB\u52A8\u5230 (" + nextPos.x + ", " + nextPos.y + ")"); // 检查是否在边界外（可以逃脱）

                var isOutOfBounds = !(_crd && CollisionDetector === void 0 ? (_reportPossibleCrUseOfCollisionDetector({
                  error: Error()
                }), CollisionDetector) : CollisionDetector).isInBounds(nextPos, _this5.matrix.width, _this5.matrix.height); // 检查是否在逃脱点上（逃脱点必须在边界外才有效）

                var isOnEscapePoint = isOutOfBounds && _this5.escapePoints.some(ep => ep.x === nextPos.x && ep.y === nextPos.y);

                console.log("\u8815\u866B " + worm.id + " \u6B65\u9AA4 " + (stepIndex + 1) + ": \u8FB9\u754C\u5916=" + isOutOfBounds + ", \u9003\u8131\u70B9=" + isOnEscapePoint + ", \u4F4D\u7F6E=(" + nextPos.x + ", " + nextPos.y + ")"); // 只有真正在边界外时才能逃脱

                if (isOutOfBounds) {
                  var _this5$audioManager2, _this5$audioManager3, _this5$effectManager2;

                  console.log("\u8815\u866B " + worm.id + " \u5728\u6B65\u9AA4 " + (stepIndex + 1) + " \u5230\u8FBE\u9003\u8131\u4F4D\u7F6E\uFF0C\u5F00\u59CB\u9003\u8131");
                  yield worm.startMoveAnimation(nextPos, moveDuration);
                  (_this5$audioManager2 = _this5.audioManager) == null ? void 0 : _this5$audioManager2.playSound('move'); // 继续移动剩余步数，让整个蠕虫都离开屏幕

                  for (var extraStep = stepIndex + 1; extraStep < path.length; extraStep++) {
                    var extraPos = path[extraStep];
                    console.log("\u8815\u866B " + worm.id + " \u989D\u5916\u6B65\u9AA4: \u79FB\u52A8\u5230 (" + extraPos.x + ", " + extraPos.y + ")");
                    yield worm.startMoveAnimation(extraPos, moveDuration);
                  } // 标记为逃脱


                  console.log("\u8815\u866B " + worm.id + " \u9003\u8131\u5B8C\u6210");
                  worm.isEscaping = false;
                  worm.markEscaped();
                  (_this5$audioManager3 = _this5.audioManager) == null ? void 0 : _this5$audioManager3.playSound('escape');
                  (_this5$effectManager2 = _this5.effectManager) == null ? void 0 : _this5$effectManager2.createEscapeEffect(_this5.worldToScreen(worm.getHeadPosition().x, worm.getHeadPosition().y), worm.color);

                  _this5.checkVictory();

                  return {
                    v: void 0
                  };
                } // 检查碰撞


                var wormLikeArray = _this5.worms.map(w => ({
                  id: w.id,
                  segments: w.segments,
                  direction: w.direction,
                  isEscaped: w.isEscaped,
                  isEscaping: w.isEscaping,
                  isAnimating: w.isAnimating
                }));

                var hasCollision = (_crd && CollisionDetector === void 0 ? (_reportPossibleCrUseOfCollisionDetector({
                  error: Error()
                }), CollisionDetector) : CollisionDetector).checkCollision({
                  id: worm.id,
                  segments: worm.segments,
                  direction: worm.direction,
                  isEscaped: worm.isEscaped,
                  isEscaping: worm.isEscaping,
                  isAnimating: worm.isAnimating
                }, nextPos, wormLikeArray);
                console.log("\u8815\u866B " + worm.id + " \u6B65\u9AA4 " + (stepIndex + 1) + ": \u78B0\u649E\u68C0\u6D4B\u7ED3\u679C=" + hasCollision);

                if (hasCollision) {
                  console.log("\u8815\u866B " + worm.id + " \u5728\u6B65\u9AA4 " + (stepIndex + 1) + " \u53D1\u751F\u78B0\u649E\uFF0C\u8C03\u7528 handleCollision");
                  yield _this5.handleCollision(worm);
                  console.log("\u8815\u866B " + worm.id + " handleCollision \u5B8C\u6210");
                  return {
                    v: void 0
                  };
                }

                console.log("\u8815\u866B " + worm.id + " \u6B65\u9AA4 " + (stepIndex + 1) + ": \u5F00\u59CB\u79FB\u52A8\u52A8\u753B");
                yield worm.startMoveAnimation(nextPos, moveDuration);
                console.log("\u8815\u866B " + worm.id + " \u6B65\u9AA4 " + (stepIndex + 1) + ": \u79FB\u52A8\u52A8\u753B\u5B8C\u6210");
                (_this5$audioManager4 = _this5.audioManager) == null ? void 0 : _this5$audioManager4.playSound('move');
              };

              for (var stepIndex = 0; stepIndex < path.length; stepIndex++) {
                var _ret = yield* _loop();

                if (typeof _ret === "object") return _ret.v;
              } // 如果走完所有路径但还在矩阵内，说明路径计算有问题，不应该逃脱


              var finalPos = worm.getHeadPosition();
              var isFinalOutOfBounds = !(_crd && CollisionDetector === void 0 ? (_reportPossibleCrUseOfCollisionDetector({
                error: Error()
              }), CollisionDetector) : CollisionDetector).isInBounds(finalPos, _this5.matrix.width, _this5.matrix.height);

              var isFinalOnEscapePoint = isFinalOutOfBounds && _this5.escapePoints.some(ep => ep.x === finalPos.x && ep.y === finalPos.y);

              console.log("\u8815\u866B " + worm.id + " \u8DEF\u5F84\u8D70\u5B8C: \u6700\u7EC8\u4F4D\u7F6E=(" + finalPos.x + ", " + finalPos.y + "), \u8FB9\u754C\u5916=" + isFinalOutOfBounds + ", \u9003\u8131\u70B9=" + isFinalOnEscapePoint); // 只有真正在边界外时才能逃脱

              if (isFinalOutOfBounds) {
                var _this5$audioManager, _this5$effectManager;

                // 标记为逃脱
                console.log("\u8815\u866B " + worm.id + " \u9003\u8131\u5B8C\u6210");
                worm.isEscaping = false;
                worm.markEscaped();
                (_this5$audioManager = _this5.audioManager) == null ? void 0 : _this5$audioManager.playSound('escape');
                (_this5$effectManager = _this5.effectManager) == null ? void 0 : _this5$effectManager.createEscapeEffect(_this5.worldToScreen(worm.getHeadPosition().x, worm.getHeadPosition().y), worm.color);

                _this5.checkVictory();
              } else {
                console.warn("\u8815\u866B " + worm.id + " \u8DEF\u5F84\u8D70\u5B8C\u4F46\u4ECD\u5728\u77E9\u9635\u5185\uFF0C\u4E0D\u5E94\u8BE5\u9003\u8131\uFF01"); // 不应该逃脱，重置蠕虫

                worm.isEscaping = false;
                yield _this5.handleCollision(worm);
              }
            } catch (error) {
              console.error("\u8815\u866B " + worm.id + " \u9003\u8131\u8FC7\u7A0B\u4E2D\u53D1\u751F\u9519\u8BEF:", error);
              console.error('错误堆栈:', error.stack);
              worm.isEscaping = false;
            }
          })();
        }
        /**
         * 移动蠕虫到障碍物并返回
         */


        moveWormToObstacleAndBack(worm, pathToObstacle) {
          var _this6 = this;

          return _asyncToGenerator(function* () {
            var _this6$audioManager, _worm$originalSegment, _worm$originalSegment2;

            console.log("\u8815\u866B " + worm.id + " \u79FB\u52A8\u5230\u969C\u788D\u7269: pathLen=" + pathToObstacle.length);
            var moveDuration = 60;
            var direction = (_crd && PathFinder === void 0 ? (_reportPossibleCrUseOfPathFinder({
              error: Error()
            }), PathFinder) : PathFinder).getDirectionVector(worm.direction); // 移动到障碍物位置

            for (var pos of pathToObstacle) {
              yield worm.startMoveAnimation(pos, moveDuration);
            } // 再移动一步到障碍物


            var lastPos = pathToObstacle.length > 0 ? pathToObstacle[pathToObstacle.length - 1] : worm.getHeadPosition();
            var obstaclePos = new Vec2(lastPos.x + direction.x, lastPos.y + direction.y);
            yield worm.startMoveAnimation(obstaclePos, moveDuration);
            (_this6$audioManager = _this6.audioManager) == null ? void 0 : _this6$audioManager.playSound('collision'); // 高亮闪烁

            yield _this6.flashWorm(worm); // 返回原位

            console.log("\u8815\u866B " + worm.id + " \u91CD\u7F6E\u5230\u539F\u4F4D");
            console.log("\u539F\u59CB\u4F4D\u7F6E: originalSegments[0]=(" + ((_worm$originalSegment = worm.originalSegments[0]) == null ? void 0 : _worm$originalSegment.x) + ", " + ((_worm$originalSegment2 = worm.originalSegments[0]) == null ? void 0 : _worm$originalSegment2.y) + "), length=" + worm.originalSegments.length);
            worm.reset();

            _this6.logRenderState(worm); // 强制刷新渲染


            _this6.updateWormVisuals(); // 等待一帧确保渲染更新


            yield _this6.wait(16);

            _this6.updateWormVisuals();

            _this6.failCount--;

            _this6.updateUI();

            if (_this6.failCount <= 0) {
              _this6.gameOver();
            }
          })();
        }
        /**
         * 尝试移动蠕虫一步
         */


        tryMoveWormOneStep(worm) {
          var _this7 = this;

          return _asyncToGenerator(function* () {
            var headPos = worm.getHeadPosition();
            var direction = (_crd && PathFinder === void 0 ? (_reportPossibleCrUseOfPathFinder({
              error: Error()
            }), PathFinder) : PathFinder).getDirectionVector(worm.direction);
            var nextPos = new Vec2(headPos.x + direction.x, headPos.y + direction.y); // 检查边界

            var isOutOfBounds = !(_crd && CollisionDetector === void 0 ? (_reportPossibleCrUseOfCollisionDetector({
              error: Error()
            }), CollisionDetector) : CollisionDetector).isInBounds(nextPos, _this7.matrix.width, _this7.matrix.height); // 检查是否在逃脱点上（逃脱点必须在边界外才有效）

            var isOnEscapePoint = isOutOfBounds && _this7.escapePoints.some(ep => ep.x === nextPos.x && ep.y === nextPos.y); // 只有真正在边界外时才能逃脱


            if (isOutOfBounds) {
              var _this7$audioManager, _this7$effectManager;

              // 可以逃脱
              console.log("\u8FB9\u754C\u5916=" + isOutOfBounds + ", \u9003\u8131\u70B9=" + isOnEscapePoint + ", \u4F4D\u7F6E=(" + nextPos.x + ", " + nextPos.y + "), \u8815\u866B\u9003\u8131");
              yield worm.startMoveAnimation(nextPos, 80);
              worm.markEscaped();
              (_this7$audioManager = _this7.audioManager) == null ? void 0 : _this7$audioManager.playSound('escape');
              (_this7$effectManager = _this7.effectManager) == null ? void 0 : _this7$effectManager.createEscapeEffect(_this7.worldToScreen(nextPos.x, nextPos.y), worm.color);

              _this7.checkVictory();

              return;
            } // 检查碰撞


            var wormLikeArray = _this7.worms.map(w => ({
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
              console.log('发生碰撞');
              yield _this7.handleCollision(worm);
            } else {
              var _this7$audioManager2;

              // 没有碰撞，正常移动一步
              console.log('正常移动一步到', nextPos.x, nextPos.y);
              yield worm.startMoveAnimation(nextPos, 80);
              (_this7$audioManager2 = _this7.audioManager) == null ? void 0 : _this7$audioManager2.playSound('move');
            }
          })();
        }
        /**
         * 处理碰撞
         */


        handleCollision(worm) {
          var _this8 = this;

          return _asyncToGenerator(function* () {
            var _this8$audioManager, _worm$originalSegment3, _worm$originalSegment4;

            console.log("\u78B0\u649E\u5904\u7406\u5F00\u59CB: \u8815\u866B " + worm.id + ", \u5F53\u524D\u5934\u90E8=(" + worm.getHeadPosition().x + ", " + worm.getHeadPosition().y + ")");
            (_this8$audioManager = _this8.audioManager) == null ? void 0 : _this8$audioManager.playSound('collision');
            yield _this8.flashWorm(worm);
            console.log("\u95EA\u70C1\u5B8C\u6210\uFF0C\u51C6\u5907\u91CD\u7F6E");
            console.log("\u539F\u59CB\u4F4D\u7F6E: originalSegments[0]=(" + ((_worm$originalSegment3 = worm.originalSegments[0]) == null ? void 0 : _worm$originalSegment3.x) + ", " + ((_worm$originalSegment4 = worm.originalSegments[0]) == null ? void 0 : _worm$originalSegment4.y) + "), length=" + worm.originalSegments.length);
            worm.reset();
            worm.isEscaping = false;
            console.log("\u91CD\u7F6E\u5B8C\u6210: isEscaped=" + worm.isEscaped + ", segments=" + worm.segments.length + ", head=(" + worm.getHeadPosition().x + ", " + worm.getHeadPosition().y + ")");

            _this8.logRenderState(worm); // 强制刷新渲染


            _this8.updateWormVisuals(); // 等待一帧确保渲染更新


            yield _this8.wait(16);

            _this8.updateWormVisuals();

            _this8.failCount--;

            _this8.updateUI();

            if (_this8.failCount <= 0) {
              _this8.gameOver();
            }
          })();
        }
        /**
         * 蠕虫闪烁效果
         */


        flashWorm(worm) {
          var _this9 = this;

          return _asyncToGenerator(function* () {
            for (var i = 0; i < 6; i++) {
              worm.setHighlighted(i % 2 === 0);
              yield _this9.wait(100);
            }

            worm.setHighlighted(false);
          })();
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
          var _this$audioManager, _this$storageManager;

          this.isVictory = true;
          this.isGameOver = true;
          (_this$audioManager = this.audioManager) == null ? void 0 : _this$audioManager.playSound('victory');
          (_this$storageManager = this.storageManager) == null ? void 0 : _this$storageManager.completeLevel(this.currentLevelId); // 显示胜利 UI

          this.scheduleOnce(() => {
            this.showResult(true);
          }, 2);
        }
        /**
         * 游戏失败处理
         */


        gameOver() {
          var _this$audioManager2;

          this.isGameOver = true;
          (_this$audioManager2 = this.audioManager) == null ? void 0 : _this$audioManager2.playSound('fail');
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
            this.levelLabel.string = "\u5173\u5361 " + this.currentLevelId;
          } // 更新红心


          for (var i = 0; i < this.heartNodes.length; i++) {
            if (this.heartNodes[i]) {
              var sprite = this.heartNodes[i].getComponent(Sprite);

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
          var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

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

          var nextLevelId = this.currentLevelId + 1;

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
        initializer: function initializer() {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "uiLayer", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "levelLabel", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "heartNodes", [_dec5], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return [];
        }
      }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "cellSize", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 60;
        }
      })), _class2)) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=1a26527c4ea173f74ee2873b689197aca490f799.js.map