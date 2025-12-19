/**
 * 游戏主入口脚本
 * 将此脚本挂载到 LaunchScene 的 Canvas 节点上
 */
import { _decorator, Component, Node, director, Button, EventHandler } from 'cc';
import { StorageManager } from './managers/StorageManager';
import { Logger } from './utils/Logger';

const { ccclass, property } = _decorator;

@ccclass('Main')
export class Main extends Component {
    @property(Node)
    public startButton: Node | null = null;

    @property(Node)
    public settingButton: Node | null = null;

    private storageManager: StorageManager | null = null;

    protected onLoad() {
        // 初始化存储管理器
        this.storageManager = this.addComponent(StorageManager);
        this.storageManager.init();

        // 绑定按钮事件
        if (this.startButton) {
            this.startButton.on(Node.EventType.TOUCH_END, this.onStartGame, this);
        }

        if (this.settingButton) {
            this.settingButton.on(Node.EventType.TOUCH_END, this.onOpenSettings, this);
        }
    }

    /**
     * 开始游戏
     */
    public onStartGame() {
        Logger.log('开始游戏');
        director.loadScene('GameScene');
    }

    /**
     * 打开设置
     */
    public onOpenSettings() {
        Logger.log('打开设置');
        // TODO: 显示设置面板
    }
}

