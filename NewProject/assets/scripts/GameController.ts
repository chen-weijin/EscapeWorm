/**
 * 游戏主控制器
 */
import { _decorator, Component, Node, director, Vec2, Vec3, instantiate, Prefab, 
    UITransform, Graphics, Color, Label, Sprite, SpriteFrame, resources, Canvas,
    EventTouch, view, screen, Size, input, Input } from 'cc';
import { Worm, WormConfig } from './entities/Worm';
import { PathFinder } from './utils/PathFinder';
import { CollisionDetector, WormLike } from './utils/CollisionDetector';
import { LevelManager, LevelData } from './managers/LevelManager';
import { StorageManager } from './managers/StorageManager';
import { AudioManager } from './managers/AudioManager';
import { EffectManager } from './managers/EffectManager';
import { Logger } from './utils/Logger';

const { ccclass, property } = _decorator;

@ccclass('GameController')
export class GameController extends Component {
    @property(Node)
    public gameArea: Node | null = null;

    @property(Node)
    public uiLayer: Node | null = null;

    @property(Label)
    public levelLabel: Label | null = null;

    @property([Node])
    public heartNodes: Node[] = [];

    @property(Node)
    public gameSceneController: Node | null = null;

    @property
    public cellSize: number = 60;

    // 管理器
    private levelManager: LevelManager | null = null;
    private storageManager: StorageManager | null = null;
    private audioManager: AudioManager | null = null;
    private effectManager: EffectManager | null = null;

    // 游戏状态
    private worms: Worm[] = [];
    private wormNodes: Node[] = [];
    private matrix: { width: number; height: number } | null = null;
    private escapePoints: Vec2[] = [];
    private failCount: number = 3;
    private isGameOver: boolean = false;
    private isVictory: boolean = false;
    private currentLevelId: number = 1;
    private isWormsAppearing: boolean = false;
    private isInitialized: boolean = false;

    // 渲染相关
    private offsetX: number = 0;
    private offsetY: number = 0;
    private graphics: Graphics | null = null;
    private zoomScale: number = 1.0; // 缩放比例，默认1.0（100%）
    
    // 拖动相关
    private isDragging: boolean = false;
    private dragStartPos: Vec2 = new Vec2();
    private dragStartOffset: Vec2 = new Vec2();
    private mapOffsetX: number = 0; // 地图偏移量 X
    private mapOffsetY: number = 0; // 地图偏移量 Y

    // 图片资源
    private wormHeadSprite: SpriteFrame | null = null;
    private wormBodySprite: SpriteFrame | null = null;
    private wormTailSprite: SpriteFrame | null = null;

    protected onLoad() {
        // 初始化管理器
        this.levelManager = this.addComponent(LevelManager);
        this.storageManager = this.addComponent(StorageManager);
        this.audioManager = this.addComponent(AudioManager);
        this.effectManager = this.addComponent(EffectManager);

        this.storageManager.init();
        this.audioManager.init(this.storageManager.getSettings());

        // 加载蠕虫图片资源
        this.loadWormImages();
    }
    
    private gameAreaSetup: boolean = false;
    
    /**
     * 设置游戏区域并注册事件（在 gameArea 被外部设置后调用）
     */
    private setupGameArea() {
        if (!this.gameArea || this.gameAreaSetup) return;
        
        // 确保 UITransform 存在且有足够的尺寸
        let uiTransform = this.gameArea.getComponent(UITransform);
        if (!uiTransform) {
            uiTransform = this.gameArea.addComponent(UITransform);
        }
        
        // 如果尺寸为 0，设置默认尺寸
        if (uiTransform.width === 0 || uiTransform.height === 0) {
            // 尝试从父节点获取尺寸
            const parentTransform = this.gameArea.parent?.getComponent(UITransform);
            if (parentTransform && parentTransform.width > 0 && parentTransform.height > 0) {
                uiTransform.width = parentTransform.width;
                uiTransform.height = parentTransform.height;
            } else {
                // 使用默认尺寸
                uiTransform.width = 720;
                uiTransform.height = 1280;
            }
            Logger.log('设置 gameArea 默认尺寸:', uiTransform.width, 'x', uiTransform.height);
        }
        
        // 创建 Graphics 组件用于绘制网格
        this.graphics = this.gameArea.getComponent(Graphics);
        if (!this.graphics) {
            this.graphics = this.gameArea.addComponent(Graphics);
        }

        // 注册触摸事件
        this.gameArea.on(Input.EventType.TOUCH_START, this.onTouchStart, this);
        this.gameArea.on(Input.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.gameArea.on(Input.EventType.TOUCH_END, this.onTouchEnd, this);
        this.gameArea.on(Input.EventType.TOUCH_CANCEL, this.onTouchCancel, this);
        
        Logger.log('触摸事件已注册到 gameArea, size=', uiTransform.width, 'x', uiTransform.height);
        
        this.gameAreaSetup = true;
    }

    /**
     * 加载蠕虫图片资源
     */
    private async loadWormImages() {
        try {
            this.wormHeadSprite = await this.loadSpriteFrame('images/worm_head');
            this.wormBodySprite = await this.loadSpriteFrame('images/worm_body');
            this.wormTailSprite = await this.loadSpriteFrame('images/worm_tail');
        } catch (e) {
            Logger.warn('蠕虫图片资源加载失败，将使用默认绘制方式');
        }
    }

    /**
     * 加载 SpriteFrame
     */
    private loadSpriteFrame(path: string): Promise<SpriteFrame> {
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
    public async initLevel(levelId: number) {
        // 暂停更新，防止在初始化过程中触发渲染
        this.isInitialized = false;
        
        // 设置游戏区域（注册触摸事件）
        this.setupGameArea();
        
        this.currentLevelId = levelId;
        this.failCount = 3;
        this.isGameOver = false;
        this.isVictory = false;
        this.worms = [];
        this.wormNodes.forEach(n => n.destroy());
        this.wormNodes = [];
        this.escapePoints = [];

        // 更新 UI
        this.updateUI();

        try {
            // 加载关卡数据
            const levelData = await this.levelManager!.loadLevel(levelId);
            this.matrix = levelData.matrix;
            this.escapePoints = levelData.escapePoints.map(p => new Vec2(p.x, p.y));

            // 计算渲染参数
            this.calculateRenderParams();

            // 创建蠕虫对象
            for (const wormConfig of levelData.worms) {
                const wormNode = new Node(`Worm_${wormConfig.id}`);
                wormNode.parent = this.gameArea;
                const worm = wormNode.addComponent(Worm);
                worm.init(wormConfig);
                worm.setVisibleSegmentCount(0);
                this.worms.push(worm);
                this.wormNodes.push(wormNode);
                Logger.log(`蠕虫 ${worm.id} 创建: 头部=(${worm.getHeadPosition().x}, ${worm.getHeadPosition().y}), 方向=${worm.direction}, 段数=${worm.segments.length}`);
            }

            // 绘制网格
            this.drawGrid();

            // 逐个显示蠕虫
            await this.animateWormsAppearance();
            
            // 初始化完成
            this.isInitialized = true;

        } catch (error) {
            Logger.error('初始化游戏场景失败:', error);
            throw error;
        }
    }

    /**
     * 计算渲染参数
     */
    private calculateRenderParams() {
        if (!this.matrix || !this.gameArea) return;

        const transform = this.gameArea.getComponent(UITransform);
        if (!transform) return;

        const areaWidth = transform.width;
        const areaHeight = transform.height;

        // 计算基础 cellSize（不考虑缩放）
        const baseCellSizeX = areaWidth / this.matrix.width;
        const baseCellSizeY = areaHeight / this.matrix.height;
        const baseCellSize = Math.min(baseCellSizeX, baseCellSizeY) * 0.9;

        // 应用缩放比例
        this.cellSize = baseCellSize * this.zoomScale;

        // 计算偏移量使网格居中，并加上拖动偏移
        const gridWidth = this.matrix.width * this.cellSize;
        const gridHeight = this.matrix.height * this.cellSize;
        const centerOffsetX = (areaWidth - gridWidth) / 2 - areaWidth / 2;
        const centerOffsetY = (areaHeight - gridHeight) / 2 - areaHeight / 2;
        this.offsetX = centerOffsetX + this.mapOffsetX;
        this.offsetY = centerOffsetY + this.mapOffsetY;
        
        Logger.log('渲染参数: areaSize=', areaWidth, 'x', areaHeight, 
            ' cellSize=', this.cellSize, ' zoomScale=', this.zoomScale, ' offset=', this.offsetX, this.offsetY);
    }

    /**
     * 设置缩放比例
     * @param scale 缩放比例（0.5-1.5）
     */
    public setZoomScale(scale: number) {
        // 限制缩放范围
        this.zoomScale = Math.max(0.5, Math.min(1.5, scale));
        
        // 重新计算渲染参数
        this.calculateRenderParams();
        
        // 限制拖动范围（缩放后可能需要调整）
        this.limitDragRange();
        this.calculateRenderParams(); // 重新计算一次以确保偏移正确
        
        // 重新绘制网格
        if (this.matrix) {
            this.drawGrid();
        }
        
        // 更新蠕虫显示
        this.updateWormVisuals();
    }

    /**
     * 重置地图位置（居中显示）
     */
    public resetMapPosition() {
        this.mapOffsetX = 0;
        this.mapOffsetY = 0;
        this.calculateRenderParams();
        if (this.matrix) {
            this.drawGrid();
        }
        this.updateWormVisuals();
    }

    /**
     * 获取当前缩放比例
     */
    public getZoomScale(): number {
        return this.zoomScale;
    }

    /**
     * 绘制网格
     */
    private drawGrid() {
        if (!this.graphics || !this.matrix) return;

        this.graphics.clear();
        this.graphics.strokeColor = new Color(224, 224, 224, 255);
        this.graphics.lineWidth = 1;

        // 绘制垂直网格线
        for (let x = 0; x <= this.matrix.width; x++) {
            const screenX = this.offsetX + x * this.cellSize;
            this.graphics.moveTo(screenX, this.offsetY);
            this.graphics.lineTo(screenX, this.offsetY + this.matrix.height * this.cellSize);
        }

        // 绘制水平网格线
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
    private worldToScreen(x: number, y: number): Vec3 {
        return new Vec3(
            this.offsetX + (x + 0.5) * this.cellSize,
            -(this.offsetY + (y + 0.5) * this.cellSize),
            0
        );
    }

    /**
     * 屏幕坐标转世界坐标
     */
    private screenToWorld(screenX: number, screenY: number): Vec2 {
        const x = Math.floor((screenX - this.offsetX) / this.cellSize);
        const y = Math.floor((-screenY - this.offsetY) / this.cellSize);
        return new Vec2(x, y);
    }

    /**
     * 检查位置是否是有效的逃脱位置
     * 逃脱位置应该在矩阵边界外，但不要太远（不超过边界1-2格）
     */
    private isValidEscapePosition(pos: Vec2): boolean {
        if (!this.matrix) {
            return false;
        }

        const matrixWidth = this.matrix.width;
        const matrixHeight = this.matrix.height;
        const maxDistance = 2; // 允许的最大距离（从边界算起）

        // 检查是否在矩阵边界外
        const isOutOfBounds = !CollisionDetector.isInBounds(pos, matrixWidth, matrixHeight);
        if (!isOutOfBounds) {
            return false;
        }

        // 检查是否在合理的逃脱范围内（不超过边界太远）
        // x 方向：应该在 -maxDistance 到 matrixWidth + maxDistance 之间
        // y 方向：应该在 -maxDistance 到 matrixHeight + maxDistance 之间
        const xInRange = pos.x >= -maxDistance && pos.x < matrixWidth + maxDistance;
        const yInRange = pos.y >= -maxDistance && pos.y < matrixHeight + maxDistance;

        return xInRange && yInRange;
    }

    /**
     * 动画显示蠕虫
     */
    private async animateWormsAppearance() {
        this.isWormsAppearing = true;
        const segmentInterval = 50;

        // 安全检查：确保 worms 是数组
        if (!Array.isArray(this.worms) || this.worms.length === 0) {
            Logger.warn('animateWormsAppearance: worms 不是数组或为空');
            this.isWormsAppearing = false;
            return;
        }

        let maxSegments = 0;
        for (const worm of this.worms) {
            if (worm && worm.segments) {
                maxSegments = Math.max(maxSegments, worm.segments.length);
            }
        }

        for (let segmentIndex = 1; segmentIndex <= maxSegments; segmentIndex++) {
            for (const worm of this.worms) {
                if (worm && worm.segments && segmentIndex <= worm.segments.length) {
                    worm.setVisibleSegmentCount(segmentIndex);
                }
            }
            this.updateWormVisuals();
            await this.wait(segmentInterval);
        }

        for (const worm of this.worms) {
            if (worm && worm.segments) {
                worm.setVisibleSegmentCount(worm.segments.length);
            }
        }

        this.isWormsAppearing = false;
    }

    /**
     * 更新蠕虫可视化
     */
    protected update(dt: number) {
        if (this.isInitialized && this.worms.length > 0) {
            this.updateWormVisuals();
        }
    }

    /**
     * 更新蠕虫可视化
     */
    private updateWormVisuals() {
        // 安全检查：确保 worms 是数组
        if (!Array.isArray(this.worms) || !Array.isArray(this.wormNodes)) {
            return;
        }

        for (let i = 0; i < this.worms.length; i++) {
            const worm = this.worms[i];
            const wormNode = this.wormNodes[i];

            // 安全检查
            if (!worm || !wormNode) {
                continue;
            }

            if (worm.hasEscaped()) {
                wormNode.active = false;
                continue;
            }

            // 确保蠕虫节点是激活的
            if (!wormNode.active) {
                Logger.log(`激活蠕虫节点 ${worm.id}`);
                wormNode.active = true;
            }

            // 获取插值后的段位置
            const segments = worm.getInterpolatedSegments();
            const visibleCount = worm.visibleSegmentCount;
            
            // 调试：检查段数据
            if (!segments || segments.length === 0) {
                Logger.error(`错误：蠕虫 ${worm.id} 的 segments 为空！`);
                continue;
            }
            
            if (visibleCount === 0 && !worm.hasEscaped()) {
                Logger.warn(`警告：蠕虫 ${worm.id} 的 visibleCount=0，但未逃脱！`);
            }

            // 更新每个段的位置
            this.renderWormSegments(wormNode, worm, segments, visibleCount);
        }
    }
    
    /**
     * 调试：打印渲染状态
     */
    private logRenderState(worm: Worm) {
        const segments = worm.getInterpolatedSegments();
        const head = segments[0];
        const screenPos = this.worldToScreen(head.x, head.y);
        Logger.log(`渲染蠕虫 ${worm.id}: segments=${segments.length}, visible=${worm.visibleSegmentCount}, head=(${head.x}, ${head.y}), screen=(${screenPos.x.toFixed(0)}, ${screenPos.y.toFixed(0)}), animating=${worm.isAnimating}, cellSize=${this.cellSize.toFixed(1)}, offset=(${this.offsetX.toFixed(0)}, ${this.offsetY.toFixed(0)})`);
    }
    
    /**
     * 调试：打印蠕虫状态
     */
    public debugWormState() {
        Logger.log('=== 蠕虫状态 ===');
        if (!Array.isArray(this.worms)) {
            Logger.log('worms 不是数组');
            return;
        }
        for (const worm of this.worms) {
            Logger.log(`蠕虫 ${worm.id}: escaped=${worm.isEscaped}, escaping=${worm.isEscaping}, animating=${worm.isAnimating}, segments=${worm.segments.length}, visible=${worm.visibleSegmentCount}`);
        }
    }

    /**
     * 渲染蠕虫段
     */
    private renderWormSegments(wormNode: Node, worm: Worm, segments: Vec2[], visibleCount: number) {
        // 确保有足够的子节点
        const currentCount = wormNode.children.length;
        for (let idx = currentCount; idx < segments.length; idx++) {
            const segmentNode = new Node(`Segment_${idx}`);
            
            // 先添加 UITransform
            const transform = segmentNode.addComponent(UITransform);
            // 再添加 Graphics 组件用于绘制
            const graphics = segmentNode.addComponent(Graphics);
            
            // 最后设置 parent，避免在设置 parent 时触发额外逻辑
            segmentNode.parent = wormNode;
        }

        // 更新每个段
        for (let i = 0; i < segments.length; i++) {
            const segmentNode = wormNode.children[i];
            const isVisible = i >= (segments.length - visibleCount);
            segmentNode.active = isVisible;
            
            // 调试：如果蠕虫应该可见但被隐藏了
            if (i === 0 && !isVisible && !worm.hasEscaped()) {
               // Logger.warn(`警告：蠕虫 ${worm.id} 头部被隐藏！segments.length=${segments.length}, visibleCount=${visibleCount}, isVisible=${isVisible}`);
            }

            if (!isVisible) continue;

            const segment = segments[i];
            const screenPos = this.worldToScreen(segment.x, segment.y);
            segmentNode.setPosition(screenPos);
            
            // 调试：检查坐标是否在合理范围内
            if (i === 0) {
                const transform = this.gameArea?.getComponent(UITransform);
                if (transform) {
                    const halfWidth = transform.width / 2;
                    const halfHeight = transform.height / 2;
                    if (Math.abs(screenPos.x) > halfWidth * 2 || Math.abs(screenPos.y) > halfHeight * 2) {
                        //Logger.warn(`警告：蠕虫 ${worm.id} 头部坐标超出屏幕范围！world=(${segment.x}, ${segment.y}) screen=(${screenPos.x.toFixed(0)}, ${screenPos.y.toFixed(0)}), 屏幕范围=(${halfWidth}, ${halfHeight})`);
                    }
                }
            }

            // 绘制段
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
                graphics.fill();

                // 绘制眼睛（头部）
                if (i === 0) {
                    this.drawEyes(graphics, worm.direction, radius);
                }
            }
        }

        // 隐藏多余的节点
        for (let i = segments.length; i < wormNode.children.length; i++) {
            wormNode.children[i].active = false;
        }
    }

    /**
     * 绘制眼睛
     */
    private drawEyes(graphics: Graphics, direction: string, radius: number) {
        graphics.fillColor = new Color(255, 255, 255, 255);
        const eyeSize = radius * 0.35;
        const eyeOffset = radius * 0.35;

        let eyeX1: number, eyeY1: number, eyeX2: number, eyeY2: number;

        switch (direction) {
            case 'left':
                eyeX1 = -eyeOffset; eyeY1 = -eyeOffset;
                eyeX2 = -eyeOffset; eyeY2 = eyeOffset;
                break;
            case 'right':
                eyeX1 = eyeOffset; eyeY1 = -eyeOffset;
                eyeX2 = eyeOffset; eyeY2 = eyeOffset;
                break;
            case 'up':
                eyeX1 = -eyeOffset; eyeY1 = eyeOffset;
                eyeX2 = eyeOffset; eyeY2 = eyeOffset;
                break;
            case 'down':
            default:
                eyeX1 = -eyeOffset; eyeY1 = -eyeOffset;
                eyeX2 = eyeOffset; eyeY2 = -eyeOffset;
                break;
        }

        // 白色眼睛
        graphics.circle(eyeX1, eyeY1, eyeSize);
        graphics.fill();
        graphics.circle(eyeX2, eyeY2, eyeSize);
        graphics.fill();

        // 黑色眼珠
        graphics.fillColor = new Color(0, 0, 0, 255);
        const pupilSize = eyeSize * 0.5;
        graphics.circle(eyeX1, eyeY1, pupilSize);
        graphics.fill();
        graphics.circle(eyeX2, eyeY2, pupilSize);
        graphics.fill();
    }

    /**
     * 处理触摸开始事件
     */
    private onTouchStart(event: EventTouch) {
        if (this.isGameOver || this.isVictory || this.isWormsAppearing) {
            return;
        }

        const location = event.getUILocation();
        this.dragStartPos = new Vec2(location.x, location.y);
        this.dragStartOffset = new Vec2(this.mapOffsetX, this.mapOffsetY);
        this.isDragging = false;
    }

    /**
     * 处理触摸移动事件
     */
    private onTouchMove(event: EventTouch) {
        if (this.isGameOver || this.isVictory || this.isWormsAppearing) {
            return;
        }

        const location = event.getUILocation();
        const deltaX = location.x - this.dragStartPos.x;
        const deltaY = location.y - this.dragStartPos.y;
        
        // 如果移动距离超过阈值，认为是拖动
        const dragThreshold = 10; // 拖动阈值（像素）
        if (Math.abs(deltaX) > dragThreshold || Math.abs(deltaY) > dragThreshold) {
            this.isDragging = true;
            
            // 更新地图偏移量
            this.mapOffsetX = this.dragStartOffset.x + deltaX;
            this.mapOffsetY = this.dragStartOffset.y - deltaY; // Y轴需要反转
            
            // 限制拖动范围（可选，根据实际需求调整）
            this.limitDragRange();
            
            // 重新计算渲染参数并更新显示
            this.calculateRenderParams();
            if (this.matrix) {
                this.drawGrid();
            }
            this.updateWormVisuals();
        }
    }

    /**
     * 处理触摸结束事件
     */
    private onTouchEnd(event: EventTouch) {
        if (this.isGameOver || this.isVictory || this.isWormsAppearing) {
            Logger.log('触摸被忽略: isGameOver=', this.isGameOver, 'isVictory=', this.isVictory, 'isWormsAppearing=', this.isWormsAppearing);
            return;
        }

        // 如果是拖动，不处理点击
        if (this.isDragging) {
            this.isDragging = false;
            return;
        }

        const location = event.getUILocation();
        const transform = this.gameArea?.getComponent(UITransform);
        if (!transform) {
            Logger.log('transform 不存在');
            return;
        }

        // 转换为节点本地坐标（考虑地图偏移）
        const localPos = transform.convertToNodeSpaceAR(new Vec3(location.x, location.y, 0));
        Logger.log('触摸位置: UI=', location.x, location.y, ' Local=', localPos.x, localPos.y);
        
        // 查找点击的蠕虫
        const clickedWorm = this.findWormAtPosition(localPos.x, localPos.y);
        if (clickedWorm) {
            Logger.log('找到蠕虫:', clickedWorm.id, 'escaped=', clickedWorm.hasEscaped(), 'animating=', clickedWorm.isAnimating);
            if (!clickedWorm.hasEscaped() && !clickedWorm.isAnimating) {
                this.handleWormClick(clickedWorm);
            }
        } else {
            Logger.log('没有找到蠕虫');
        }
    }

    /**
     * 处理触摸取消事件
     */
    private onTouchCancel(event: EventTouch) {
        this.isDragging = false;
    }

    /**
     * 限制拖动范围
     */
    private limitDragRange() {
        if (!this.matrix || !this.gameArea) return;

        const transform = this.gameArea.getComponent(UITransform);
        if (!transform) return;

        const areaWidth = transform.width;
        const areaHeight = transform.height;

        // 计算网格的实际尺寸
        const gridWidth = this.matrix.width * this.cellSize;
        const gridHeight = this.matrix.height * this.cellSize;

        // 限制拖动范围，确保地图不会移出屏幕太远
        const maxOffsetX = Math.max(0, (gridWidth - areaWidth) / 2);
        const maxOffsetY = Math.max(0, (gridHeight - areaHeight) / 2);

        this.mapOffsetX = Math.max(-maxOffsetX, Math.min(maxOffsetX, this.mapOffsetX));
        this.mapOffsetY = Math.max(-maxOffsetY, Math.min(maxOffsetY, this.mapOffsetY));
    }

    /**
     * 查找点击位置的蠕虫
     */
    private findWormAtPosition(localX: number, localY: number): Worm | null {
        const clickRadius = this.cellSize * 0.6;

        if (!Array.isArray(this.worms)) {
            return null;
        }

        for (const worm of this.worms) {
            if (worm.hasEscaped()) continue;

            for (const segment of worm.getAllSegments()) {
                // 计算蠕虫段在本地坐标系中的位置
                const segmentLocalX = this.offsetX + (segment.x + 0.5) * this.cellSize;
                const segmentLocalY = -(this.offsetY + (segment.y + 0.5) * this.cellSize);
                
                const dx = localX - segmentLocalX;
                const dy = localY - segmentLocalY;
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
    private async handleWormClick(worm: Worm) {
        Logger.log('处理蠕虫点击: id=', worm.id, ' head=', worm.getHeadPosition(), ' dir=', worm.direction);
        this.audioManager?.playSound('click');

        // 获取障碍物
        const obstacles = this.getObstacles(worm);
        Logger.log('障碍物数量:', obstacles.length);

        // 查找逃脱路径
        const result = PathFinder.findPath(
            worm.getHeadPosition(),
            worm.direction,
            worm.getLength(),
            worm.getAllSegments(),
            this.matrix!.width,
            this.matrix!.height,
            obstacles,
            this.escapePoints
        );
        Logger.log('路径查找结果: canEscape=', result.canEscape, ' pathLen=', result.path.length);

        try {
            if (result.canEscape && result.path.length > 0) {
                Logger.log('蠕虫开始逃脱');
                await this.moveWormToEscape(worm, result.path);
                Logger.log('蠕虫逃脱流程完成');
            } else if (!result.canEscape && result.pathToObstacle && result.pathToObstacle.length > 0) {
                Logger.log('蠕虫碰到障碍物，后退');
                await this.moveWormToObstacleAndBack(worm, result.pathToObstacle);
                Logger.log('蠕虫后退流程完成');
            } else {
                Logger.log('尝试向前移动一步');
                await this.tryMoveWormOneStep(worm);
                Logger.log('移动一步流程完成');
            }
        } catch (error) {
            Logger.error('处理蠕虫移动时发生错误:', error);
            Logger.error('错误堆栈:', error.stack);
        }
    }

    /**
     * 获取障碍物
     */
    private getObstacles(excludeWorm: Worm): Vec2[] {
        const obstacles: Vec2[] = [];
        if (!Array.isArray(this.worms)) {
            return obstacles;
        }
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
    private async moveWormToEscape(worm: Worm, path: Vec2[]) {
        try {
            Logger.log(`蠕虫 ${worm.id} 开始逃脱，路径长度=${path.length}`);
            worm.isEscaping = true;
            const moveDuration = 80;

            for (let stepIndex = 0; stepIndex < path.length; stepIndex++) {
                const nextPos = path[stepIndex];
                Logger.log(`蠕虫 ${worm.id} 步骤 ${stepIndex + 1}/${path.length}: 移动到 (${nextPos.x}, ${nextPos.y})`);
                
                // 检查是否在边界外（可以逃脱）
                // 边界外应该是紧邻矩阵边界的位置，不应该太远
                const isOutOfBounds = this.isValidEscapePosition(nextPos);
                // 检查是否在逃脱点上（逃脱点必须在边界外才有效）
                const isOnEscapePoint = isOutOfBounds && this.escapePoints.some(ep => ep.x === nextPos.x && ep.y === nextPos.y);
                
                console.log(`蠕虫 ${worm.id} 步骤 ${stepIndex + 1}: 边界外=${isOutOfBounds}, 逃脱点=${isOnEscapePoint}, 位置=(${nextPos.x}, ${nextPos.y})`);
                
                // 只有真正在边界外时才能逃脱
                if (isOutOfBounds) {
                    Logger.log(`蠕虫 ${worm.id} 在步骤 ${stepIndex + 1} 到达逃脱位置，开始逃脱`);
                    await worm.startMoveAnimation(nextPos, moveDuration);
                    this.audioManager?.playSound('move');
                    
                    // 继续移动剩余步数，让整个蠕虫都离开屏幕
                    // 但限制额外步数，避免移动到过远的位置
                    const maxExtraSteps = Math.min(worm.getLength(), 10); // 最多额外移动10步或蠕虫长度
                    for (let extraStep = stepIndex + 1; extraStep < path.length && (extraStep - stepIndex) <= maxExtraSteps; extraStep++) {
                        const extraPos = path[extraStep];
                        // 检查额外位置是否在合理范围内（不超过边界太远）
                        if (this.isValidEscapePosition(extraPos)) {
                            Logger.log(`蠕虫 ${worm.id} 额外步骤: 移动到 (${extraPos.x}, ${extraPos.y})`);
                            await worm.startMoveAnimation(extraPos, moveDuration);
                        } else {
                            break; // 如果位置太远，停止移动
                        }
                    }
                    
                    // 标记为逃脱
                    Logger.log(`蠕虫 ${worm.id} 逃脱完成`);
                    worm.isEscaping = false;
                    worm.markEscaped();
                    this.audioManager?.playSound('escape');
                    this.effectManager?.createEscapeEffect(
                        this.worldToScreen(worm.getHeadPosition().x, worm.getHeadPosition().y),
                        worm.color
                    );
                    this.checkVictory();
                    return;
                }
                
                // 检查碰撞
                if (!Array.isArray(this.worms)) {
                    Logger.error('worms 不是数组，无法检查碰撞');
                    return;
                }
                const wormLikeArray = this.worms.map(w => ({
                    id: w.id,
                    segments: w.segments,
                    direction: w.direction,
                    isEscaped: w.isEscaped,
                    isEscaping: w.isEscaping,
                    isAnimating: w.isAnimating
                }));

                const hasCollision = CollisionDetector.checkCollision({
                    id: worm.id,
                    segments: worm.segments,
                    direction: worm.direction,
                    isEscaped: worm.isEscaped,
                    isEscaping: worm.isEscaping,
                    isAnimating: worm.isAnimating
                }, nextPos, wormLikeArray);
                
                Logger.log(`蠕虫 ${worm.id} 步骤 ${stepIndex + 1}: 碰撞检测结果=${hasCollision}`);
                
                if (hasCollision) {
                    Logger.log(`蠕虫 ${worm.id} 在步骤 ${stepIndex + 1} 发生碰撞，调用 handleCollision`);
                    await this.handleCollision(worm);
                    Logger.log(`蠕虫 ${worm.id} handleCollision 完成`);
                    return;
                }

                Logger.log(`蠕虫 ${worm.id} 步骤 ${stepIndex + 1}: 开始移动动画`);
                await worm.startMoveAnimation(nextPos, moveDuration);
                Logger.log(`蠕虫 ${worm.id} 步骤 ${stepIndex + 1}: 移动动画完成`);
                this.audioManager?.playSound('move');
            }

            // 如果走完所有路径但还在矩阵内，说明路径计算有问题，不应该逃脱
            const finalPos = worm.getHeadPosition();
            const isFinalOutOfBounds = this.isValidEscapePosition(finalPos);
            const isFinalOnEscapePoint = isFinalOutOfBounds && this.escapePoints.some(ep => ep.x === finalPos.x && ep.y === finalPos.y);
            
            console.log(`蠕虫 ${worm.id} 路径走完: 最终位置=(${finalPos.x}, ${finalPos.y}), 边界外=${isFinalOutOfBounds}, 逃脱点=${isFinalOnEscapePoint}`);
            
            // 只有真正在边界外时才能逃脱
            if (isFinalOutOfBounds) {
                // 标记为逃脱
                Logger.log(`蠕虫 ${worm.id} 逃脱完成`);
                worm.isEscaping = false;
                worm.markEscaped();
                this.audioManager?.playSound('escape');
                this.effectManager?.createEscapeEffect(
                    this.worldToScreen(worm.getHeadPosition().x, worm.getHeadPosition().y),
                    worm.color
                );
                this.checkVictory();
            } else {
                Logger.warn(`蠕虫 ${worm.id} 路径走完但仍在矩阵内，不应该逃脱！`);
                // 不应该逃脱，重置蠕虫
                worm.isEscaping = false;
                await this.handleCollision(worm);
            }
        } catch (error) {
            Logger.error(`蠕虫 ${worm.id} 逃脱过程中发生错误:`, error);
            Logger.error('错误堆栈:', error.stack);
            worm.isEscaping = false;
        }
    }

    /**
     * 移动蠕虫到障碍物并返回
     */
    private async moveWormToObstacleAndBack(worm: Worm, pathToObstacle: Vec2[]) {
        Logger.log(`蠕虫 ${worm.id} 移动到障碍物: pathLen=${pathToObstacle.length}`);
        const moveDuration = 60;
        const direction = PathFinder.getDirectionVector(worm.direction);

        // 移动到障碍物位置
        for (const pos of pathToObstacle) {
            await worm.startMoveAnimation(pos, moveDuration);
        }

        // 再移动一步到障碍物
        const lastPos = pathToObstacle.length > 0 
            ? pathToObstacle[pathToObstacle.length - 1] 
            : worm.getHeadPosition();
        const obstaclePos = new Vec2(lastPos.x + direction.x, lastPos.y + direction.y);
        await worm.startMoveAnimation(obstaclePos, moveDuration);

        this.audioManager?.playSound('collision');

        // 高亮闪烁
        await this.flashWorm(worm);

        // 返回原位
        Logger.log(`蠕虫 ${worm.id} 重置到原位`);
        Logger.log(`原始位置: originalSegments[0]=(${worm.originalSegments[0]?.x}, ${worm.originalSegments[0]?.y}), length=${worm.originalSegments.length}`);
        worm.reset();
        this.logRenderState(worm);
        
        // 强制刷新渲染
        this.updateWormVisuals();
        
        // 等待一帧确保渲染更新
        await this.wait(16);
        this.updateWormVisuals();

        this.failCount--;
        this.updateUI();

        if (this.failCount <= 0) {
            this.gameOver();
        }
    }

    /**
     * 尝试移动蠕虫一步
     */
    private async tryMoveWormOneStep(worm: Worm) {
        const headPos = worm.getHeadPosition();
        const direction = PathFinder.getDirectionVector(worm.direction);
        const nextPos = new Vec2(headPos.x + direction.x, headPos.y + direction.y);

        // 检查边界
        const isOutOfBounds = this.isValidEscapePosition(nextPos);
        // 检查是否在逃脱点上（逃脱点必须在边界外才有效）
        const isOnEscapePoint = isOutOfBounds && this.escapePoints.some(ep => ep.x === nextPos.x && ep.y === nextPos.y);
        
        // 只有真正在边界外时才能逃脱
        if (isOutOfBounds) {
            // 可以逃脱
            console.log(`边界外=${isOutOfBounds}, 逃脱点=${isOnEscapePoint}, 位置=(${nextPos.x}, ${nextPos.y}), 蠕虫逃脱`);
            await worm.startMoveAnimation(nextPos, 80);
            worm.markEscaped();
            this.audioManager?.playSound('escape');
            this.effectManager?.createEscapeEffect(
                this.worldToScreen(nextPos.x, nextPos.y),
                worm.color
            );
            this.checkVictory();
            return;
        }

        // 检查碰撞
        const wormLikeArray = this.worms.map(w => ({
            id: w.id,
            segments: w.segments,
            direction: w.direction,
            isEscaped: w.isEscaped,
            isEscaping: w.isEscaping,
            isAnimating: w.isAnimating
        }));

        if (CollisionDetector.checkCollision({
            id: worm.id,
            segments: worm.segments,
            direction: worm.direction,
            isEscaped: worm.isEscaped,
            isEscaping: worm.isEscaping,
            isAnimating: worm.isAnimating
        }, nextPos, wormLikeArray)) {
            Logger.log('发生碰撞');
            await this.handleCollision(worm);
        } else {
            // 没有碰撞，正常移动一步
            Logger.log('正常移动一步到', nextPos.x, nextPos.y);
            await worm.startMoveAnimation(nextPos, 80);
            this.audioManager?.playSound('move');
        }
    }

    /**
     * 处理碰撞
     */
    private async handleCollision(worm: Worm) {
        Logger.log(`碰撞处理开始: 蠕虫 ${worm.id}, 当前头部=(${worm.getHeadPosition().x}, ${worm.getHeadPosition().y})`);
        this.audioManager?.playSound('collision');
        await this.flashWorm(worm);
        Logger.log(`闪烁完成，准备重置`);
        Logger.log(`原始位置: originalSegments[0]=(${worm.originalSegments[0]?.x}, ${worm.originalSegments[0]?.y}), length=${worm.originalSegments.length}`);
        worm.reset();
        worm.isEscaping = false;
        Logger.log(`重置完成: isEscaped=${worm.isEscaped}, segments=${worm.segments.length}, head=(${worm.getHeadPosition().x}, ${worm.getHeadPosition().y})`);
        this.logRenderState(worm);
        
        // 强制刷新渲染
        this.updateWormVisuals();
        
        // 等待一帧确保渲染更新
        await this.wait(16);
        this.updateWormVisuals();

        this.failCount--;
        this.updateUI();

        if (this.failCount <= 0) {
            this.gameOver();
        }
    }

    /**
     * 蠕虫闪烁效果
     */
    private async flashWorm(worm: Worm): Promise<void> {
        for (let i = 0; i < 6; i++) {
            worm.setHighlighted(i % 2 === 0);
            await this.wait(100);
        }
        worm.setHighlighted(false);
    }

    /**
     * 检查胜利
     */
    private checkVictory() {
        if (!Array.isArray(this.worms) || this.worms.length === 0) {
            return;
        }
        if (this.worms.every(worm => worm.hasEscaped())) {
            this.victory();
        }
    }

    /**
     * 胜利处理
     */
    private victory() {
        this.isVictory = true;
        this.isGameOver = true;
        this.audioManager?.playSound('victory');
        this.storageManager?.completeLevel(this.currentLevelId);

        // 显示胜利 UI
        this.scheduleOnce(() => {
            this.showResult(true);
        }, 2);
    }

    /**
     * 游戏失败处理
     */
    private gameOver() {
        this.isGameOver = true;
        this.audioManager?.playSound('fail');

        this.scheduleOnce(() => {
            this.showResult(false);
        }, 1);
    }

    /**
     * 显示结果
     */
    private showResult(isVictory: boolean) {
        Logger.log(isVictory ? '胜利！' : '失败！');
        
        // 查找 GameSceneController 并调用其 showResult 方法
        let sceneController: any = null;
        
        if (this.gameSceneController) {
            sceneController = this.gameSceneController.getComponent('GameSceneController');
        } else {
            // 如果没有直接引用，尝试从父节点查找
            let parent = this.node.parent;
            while (parent) {
                sceneController = parent.getComponent('GameSceneController');
                if (sceneController) {
                    break;
                }
                parent = parent.parent;
            }
        }
        
        if (sceneController && typeof sceneController.showResult === 'function') {
            sceneController.showResult(isVictory, this.currentLevelId);
        } else {
            Logger.error('未找到 GameSceneController，无法显示结果');
        }
    }

    /**
     * 更新 UI
     */
    private updateUI() {
        if (this.levelLabel) {
            this.levelLabel.string = `关卡 ${this.currentLevelId}`;
        }

        // 更新红心
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
    private wait(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /**
     * 十六进制颜色转 Color
     */
    private hexToColor(hex: string): Color {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        if (result) {
            return new Color(
                parseInt(result[1], 16),
                parseInt(result[2], 16),
                parseInt(result[3], 16),
                255
            );
        }
        return new Color(255, 255, 255, 255);
    }

    /**
     * 重新开始当前关卡
     */
    public restartLevel() {
        this.initLevel(this.currentLevelId);
    }

    /**
     * 返回主菜单
     */
    public returnToMenu() {
        director.loadScene('LaunchScene');
    }

    /**
     * 进入下一关
     */
    public nextLevel() {
        const nextLevelId = this.currentLevelId + 1;
        if (this.storageManager?.isLevelUnlocked(nextLevelId)) {
            this.initLevel(nextLevelId);
        } else {
            this.returnToMenu();
        }
    }
}

