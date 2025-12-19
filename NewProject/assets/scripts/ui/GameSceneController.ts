/**
 * 游戏场景控制器
 * 用于管理 GameScene 中的 UI 和游戏逻辑初始化
 */
import { _decorator, Component, Node, Label, Sprite, Color, director, Button, 
    Graphics, UITransform, Vec3, tween } from 'cc';
import { GameController } from '../GameController';
import { StorageManager } from '../managers/StorageManager';
import { ResultController } from './ResultController';
import { Logger } from '../utils/Logger';

const { ccclass, property } = _decorator;

@ccclass('GameSceneController')
export class GameSceneController extends Component {
    @property(Node)
    public gameArea: Node | null = null;

    @property(Label)
    public levelLabel: Label | null = null;

    @property([Node])
    public heartNodes: Node[] = [];

    @property(Node)
    public settingsButton: Node | null = null;

    @property(Node)
    public menuButton: Node | null = null;

    @property(Node)
    public restartButton: Node | null = null;

    @property(Node)
    public resultPanel: Node | null = null;

    @property(Label)
    public resultLabel: Label | null = null;

    @property(Node)
    public nextButton: Node | null = null;

    private gameController: GameController | null = null;
    private storageManager: StorageManager | null = null;
    private currentLevelId: number = 1;

    protected onLoad() {
        // 初始化存储管理器获取当前关卡
        this.storageManager = this.addComponent(StorageManager);
        this.storageManager.init();
        this.currentLevelId = this.storageManager.getCurrentLevel();

        // 隐藏结果面板
        if (this.resultPanel) {
            this.resultPanel.active = false;
        }

        // 设置按钮事件
        this.setupButtons();

        // 初始化游戏控制器
        this.initGameController();
    }

    /**
     * 初始化游戏控制器
     */
    private async initGameController() {
        if (!this.gameArea) {
            Logger.error('游戏区域节点未设置');
            return;
        }

        // 创建游戏控制器节点
        const controllerNode = new Node('GameController');
        controllerNode.parent = this.node;
        this.gameController = controllerNode.addComponent(GameController);

        // 设置游戏控制器的属性
        this.gameController.gameArea = this.gameArea;
        this.gameController.levelLabel = this.levelLabel;
        this.gameController.heartNodes = this.heartNodes;
        // 设置 GameSceneController 的引用，以便 GameController 可以调用 showResult
        this.gameController.gameSceneController = this.node;

        // 初始化关卡
        try {
            await this.gameController.initLevel(this.currentLevelId);
            this.updateLevelLabel();
        } catch (error) {
            Logger.error('初始化关卡失败:', error);
            this.showError('加载关卡失败');
        }
    }

    /**
     * 设置按钮事件
     */
    private setupButtons() {
        if (this.settingsButton) {
            this.settingsButton.on(Node.EventType.TOUCH_END, this.onSettingsClick, this);
        }
        if (this.menuButton) {
            this.menuButton.on(Node.EventType.TOUCH_END, this.onMenuClick, this);
        }
        if (this.restartButton) {
            this.restartButton.on(Node.EventType.TOUCH_END, this.onRestartClick, this);
        }
        if (this.nextButton) {
            this.nextButton.on(Node.EventType.TOUCH_END, this.onNextClick, this);
        }
    }

    /**
     * 更新关卡标签
     */
    private updateLevelLabel() {
        if (this.levelLabel) {
            this.levelLabel.string = `关卡 ${this.currentLevelId}`;
        }
    }

    /**
     * 设置按钮点击
     */
    private onSettingsClick() {
        Logger.log('打开设置');
        // TODO: 实现设置面板
    }

    /**
     * 返回菜单按钮点击
     */
    private onMenuClick() {
        director.loadScene('LaunchScene');
    }

    /**
     * 重新开始按钮点击
     */
    private onRestartClick() {
        this.gameController?.restartLevel();
    }

    /**
     * 重新开始关卡（供 ResultController 调用）
     */
    public restartLevel() {
        this.hideResult();
        this.gameController?.restartLevel();
    }

    /**
     * 下一关按钮点击
     */
    private onNextClick() {
        this.gameController?.nextLevel();
    }

    /**
     * 显示结果弹窗
     */
    public showResult(isVictory: boolean, levelId: number) {
        if (!this.resultPanel) {
            Logger.error('结果面板未设置');
            return;
        }

        // 获取 ResultController 组件
        let resultController = this.resultPanel.getComponent(ResultController);
        if (!resultController) {
            Logger.warn('结果面板上没有 ResultController 组件，尝试添加');
            resultController = this.resultPanel.addComponent(ResultController);
        }

        // 初始化结果控制器
        resultController.init(isVictory, levelId);

        // 显示弹窗（带动画效果）
        this.resultPanel.active = true;
        
        // 设置初始缩放为0，然后动画到1
        this.resultPanel.setScale(0, 0, 1);
        tween(this.resultPanel)
            .to(0.3, { scale: new Vec3(1, 1, 1) }, { easing: 'backOut' })
            .start();
    }

    /**
     * 隐藏结果弹窗
     */
    public hideResult() {
        if (!this.resultPanel) {
            return;
        }

        // 动画隐藏
        tween(this.resultPanel)
            .to(0.2, { scale: new Vec3(0, 0, 1) }, { easing: 'backIn' })
            .call(() => {
                this.resultPanel!.active = false;
            })
            .start();
    }

    /**
     * 显示错误信息
     */
    private showError(message: string) {
        Logger.error(message);
        // TODO: 显示错误提示 UI
    }

    /**
     * 更新红心显示
     */
    public updateHearts(failCount: number) {
        for (let i = 0; i < this.heartNodes.length; i++) {
            if (this.heartNodes[i]) {
                const graphics = this.heartNodes[i].getComponent(Graphics);
                if (graphics) {
                    graphics.clear();
                    graphics.fillColor = i < failCount ? new Color(244, 67, 54, 255) : new Color(200, 200, 200, 255);
                    graphics.circle(0, 0, 20);
                    graphics.fill();
                }
            }
        }
    }
}

