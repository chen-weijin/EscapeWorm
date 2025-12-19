/**
 * 菜单场景控制器
 */
import { _decorator, Component, Node, Label, Sprite, Color, director, UITransform, 
    Graphics, EventTouch, Vec3, input, Input } from 'cc';
import { StorageManager } from '../managers/StorageManager';
import { AudioManager } from '../managers/AudioManager';
import { Logger } from '../utils/Logger';

const { ccclass, property } = _decorator;

interface LevelInfo {
    id: number;
    unlocked: boolean;
    completed: boolean;
}

@ccclass('MenuController')
export class MenuController extends Component {
    @property(Node)
    public levelGrid: Node | null = null;

    @property(Label)
    public titleLabel: Label | null = null;

    private storageManager: StorageManager | null = null;
    private audioManager: AudioManager | null = null;
    private levels: LevelInfo[] = [];
    private totalLevels: number = 3;

    // 布局参数
    private cols: number = 3;
    private cellSize: number = 200;
    private startX: number = 0;
    private startY: number = 0;

    protected onLoad() {
        this.storageManager = this.addComponent(StorageManager);
        this.audioManager = this.addComponent(AudioManager);

        this.storageManager.init();
        this.audioManager.init(this.storageManager.getSettings());

        this.initLevels();
        this.createLevelButtons();

        // 注册触摸事件
        if (this.levelGrid) {
            this.levelGrid.on(Input.EventType.TOUCH_END, this.onTouchEnd, this);
        }
    }

    /**
     * 初始化关卡信息
     */
    private initLevels() {
        this.levels = [];
        for (let i = 1; i <= this.totalLevels; i++) {
            this.levels.push({
                id: i,
                unlocked: this.storageManager!.isLevelUnlocked(i),
                completed: this.storageManager!.isLevelCompleted(i)
            });
        }
    }

    /**
     * 创建关卡按钮
     */
    private createLevelButtons() {
        if (!this.levelGrid) return;

        const transform = this.levelGrid.getComponent(UITransform);
        if (!transform) return;

        const gridWidth = transform.width;
        const gridHeight = transform.height;

        const rows = Math.ceil(this.levels.length / this.cols);
        this.cellSize = Math.min(gridWidth / this.cols, gridHeight / rows) * 0.85;
        this.startX = -(this.cols * this.cellSize) / 2 + this.cellSize / 2;
        this.startY = ((rows - 1) * this.cellSize) / 2;

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
    private createLevelButton(level: LevelInfo, x: number, y: number) {
        const buttonNode = new Node(`Level_${level.id}`);
        buttonNode.parent = this.levelGrid;
        buttonNode.setPosition(x, y, 0);

        // 添加 UITransform
        const transform = buttonNode.addComponent(UITransform);
        transform.width = this.cellSize * 0.8;
        transform.height = this.cellSize * 0.8;

        // 添加 Graphics 绘制按钮
        const graphics = buttonNode.addComponent(Graphics);
        const radius = this.cellSize / 2 - 20;

        // 绘制按钮背景
        if (level.unlocked) {
            graphics.fillColor = level.completed ? new Color(76, 175, 80, 255) : new Color(33, 150, 243, 255);
        } else {
            graphics.fillColor = new Color(200, 200, 200, 255);
        }
        graphics.circle(0, 0, radius);
        graphics.fill();

        // 绘制边框
        graphics.strokeColor = level.unlocked 
            ? (level.completed ? new Color(56, 142, 60, 255) : new Color(25, 118, 210, 255))
            : new Color(150, 150, 150, 255);
        graphics.lineWidth = 4;
        graphics.stroke();

        // 添加关卡编号标签
        const labelNode = new Node('Label');
        labelNode.parent = buttonNode;
        const label = labelNode.addComponent(Label);
        label.string = level.unlocked ? level.id.toString() : '🔒';
        label.fontSize = 48;
        label.color = new Color(255, 255, 255, 255);
        labelNode.addComponent(UITransform);

        // 添加完成标记
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
    private onTouchEnd(event: EventTouch) {
        const location = event.getUILocation();
        const transform = this.levelGrid?.getComponent(UITransform);
        if (!transform) return;

        const localPos = transform.convertToNodeSpaceAR(new Vec3(location.x, location.y, 0));

        // 检查点击的关卡
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
    private onLevelClick(level: LevelInfo) {
        this.audioManager?.playSound('click');

        if (level.unlocked) {
            Logger.log(`开始关卡 ${level.id}`);
            // 保存当前关卡并切换场景
            this.storageManager?.setCurrentLevel(level.id);
            director.loadScene('GameScene');
        } else {
            Logger.log('关卡未解锁');
        }
    }
}

