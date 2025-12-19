/**
 * 结果场景控制器
 */
import { _decorator, Component, Node, Label, Sprite, Color, director, UITransform, 
    Graphics, EventTouch, Vec3, Button, input, Input } from 'cc';
import { StorageManager } from '../managers/StorageManager';
import { AudioManager } from '../managers/AudioManager';

const { ccclass, property } = _decorator;

@ccclass('ResultController')
export class ResultController extends Component {
    @property(Label)
    public resultLabel: Label | null = null;

    @property(Label)
    public levelLabel: Label | null = null;

    @property(Node)
    public nextButton: Node | null = null;

    @property(Node)
    public replayButton: Node | null = null;

    @property(Node)
    public menuButton: Node | null = null;

    @property(Node)
    public backgroundNode: Node | null = null;

    private storageManager: StorageManager | null = null;
    private audioManager: AudioManager | null = null;
    private isVictory: boolean = false;
    private levelId: number = 1;

    protected onLoad() {
        this.storageManager = this.addComponent(StorageManager);
        this.audioManager = this.addComponent(AudioManager);

        this.storageManager.init();
        this.audioManager.init(this.storageManager.getSettings());

        // 从存储中获取当前关卡和结果
        this.levelId = this.storageManager.getCurrentLevel();
        // 结果应该通过某种方式传递，这里简单判断关卡是否完成
        this.isVictory = this.storageManager.isLevelCompleted(this.levelId);

        this.setupUI();
        this.setupButtons();
    }

    /**
     * 设置 UI
     */
    private setupUI() {
        // 设置背景颜色
        if (this.backgroundNode) {
            const graphics = this.backgroundNode.getComponent(Graphics) || this.backgroundNode.addComponent(Graphics);
            const transform = this.backgroundNode.getComponent(UITransform);
            if (transform) {
                graphics.fillColor = this.isVictory ? new Color(232, 245, 233, 255) : new Color(255, 235, 238, 255);
                graphics.rect(-transform.width / 2, -transform.height / 2, transform.width, transform.height);
                graphics.fill();
            }
        }

        // 设置结果文字
        if (this.resultLabel) {
            this.resultLabel.string = this.isVictory ? '胜利！' : '失败';
            this.resultLabel.color = this.isVictory ? new Color(76, 175, 80, 255) : new Color(244, 67, 54, 255);
        }

        // 设置关卡信息
        if (this.levelLabel) {
            this.levelLabel.string = `关卡 ${this.levelId}`;
        }

        // 根据结果显示/隐藏下一关按钮
        if (this.nextButton) {
            this.nextButton.active = this.isVictory;
        }
    }

    /**
     * 设置按钮事件
     */
    private setupButtons() {
        if (this.nextButton) {
            this.nextButton.on(Input.EventType.TOUCH_END, this.onNextClick, this);
        }
        if (this.replayButton) {
            this.replayButton.on(Input.EventType.TOUCH_END, this.onReplayClick, this);
        }
        if (this.menuButton) {
            this.menuButton.on(Input.EventType.TOUCH_END, this.onMenuClick, this);
        }
    }

    /**
     * 下一关按钮点击
     */
    private onNextClick() {
        this.audioManager?.playSound('click');
        const nextLevel = this.levelId + 1;
        
        // 查找 GameSceneController
        const sceneController = this.findGameSceneController();
        if (sceneController) {
            // 隐藏结果面板
            if (typeof (sceneController as any).hideResult === 'function') {
                (sceneController as any).hideResult();
            }
            
            // 如果有下一关，加载下一关
            if (this.storageManager?.isLevelUnlocked(nextLevel)) {
                this.storageManager.setCurrentLevel(nextLevel);
                // 重新加载游戏场景
                setTimeout(() => {
                    director.loadScene('GameScene');
                }, 300);
            } else {
                // 没有下一关，返回菜单
                setTimeout(() => {
                    director.loadScene('LaunchScene');
                }, 300);
            }
        } else {
            // 如果没有找到 GameSceneController，使用原来的逻辑
            if (this.storageManager?.isLevelUnlocked(nextLevel)) {
                this.storageManager.setCurrentLevel(nextLevel);
                director.loadScene('GameScene');
            } else {
                director.loadScene('LaunchScene');
            }
        }
    }

    /**
     * 重玩按钮点击
     */
    private onReplayClick() {
        this.audioManager?.playSound('click');
        
        // 查找 GameSceneController
        const sceneController = this.findGameSceneController();
        if (sceneController) {
            // 隐藏结果面板
            if (typeof (sceneController as any).hideResult === 'function') {
                (sceneController as any).hideResult();
            }
            
            // 重新开始当前关卡
            if (typeof (sceneController as any).restartLevel === 'function') {
                setTimeout(() => {
                    (sceneController as any).restartLevel();
                }, 300);
            } else {
                setTimeout(() => {
                    director.loadScene('GameScene');
                }, 300);
            }
        } else {
            director.loadScene('GameScene');
        }
    }

    /**
     * 返回菜单按钮点击
     */
    private onMenuClick() {
        this.audioManager?.playSound('click');
        
        // 查找 GameSceneController
        const sceneController = this.findGameSceneController();
        if (sceneController) {
            // 隐藏结果面板
            if (typeof (sceneController as any).hideResult === 'function') {
                (sceneController as any).hideResult();
            }
        }
        
        setTimeout(() => {
            director.loadScene('LaunchScene');
        }, 300);
    }

    /**
     * 查找 GameSceneController
     */
    private findGameSceneController(): any {
        let parent = this.node.parent;
        while (parent) {
            const sceneController = parent.getComponent('GameSceneController');
            if (sceneController) {
                return sceneController;
            }
            parent = parent.parent;
        }
        return null;
    }

    /**
     * 初始化（用于从其他场景传递数据）
     */
    public init(isVictory: boolean, levelId: number) {
        this.isVictory = isVictory;
        this.levelId = levelId;
        
        // 如果还没有初始化，先初始化
        if (!this.storageManager) {
            this.storageManager = this.addComponent(StorageManager);
            this.audioManager = this.addComponent(AudioManager);
            this.storageManager.init();
            this.audioManager.init(this.storageManager.getSettings());
            this.setupButtons();
        }
        
        this.setupUI();
    }
}

