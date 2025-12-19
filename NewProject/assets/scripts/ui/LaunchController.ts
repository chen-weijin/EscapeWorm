/**
 * 启动场景控制器
 */
import { _decorator, Component, Node, director, Label } from 'cc';
import { StorageManager } from '../managers/StorageManager';

const { ccclass, property } = _decorator;

@ccclass('LaunchController')
export class LaunchController extends Component {
    @property(Label)
    public titleLabel: Label | null = null;

    @property(Node)
    public startButton: Node | null = null;

    private storageManager: StorageManager | null = null;

    protected onLoad() {
        this.storageManager = this.addComponent(StorageManager);
        this.storageManager.init();

        // 设置标题
        if (this.titleLabel) {
            this.titleLabel.string = '蠕虫逃脱';
        }

        // 自动进入菜单场景
        this.scheduleOnce(() => {
            this.enterMenu();
        }, 1);
    }

    /**
     * 进入菜单
     */
    public enterMenu() {
        director.loadScene('GameScene');
    }

    /**
     * 开始游戏按钮点击
     */
    public onStartClick() {
        this.enterMenu();
    }
}

