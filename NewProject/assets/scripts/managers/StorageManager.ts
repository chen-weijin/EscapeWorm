/**
 * 存储管理器
 * 管理本地数据存储
 */
import { _decorator, Component, sys } from 'cc';
import { Logger } from '../utils/Logger';
const { ccclass, property } = _decorator;

@ccclass('StorageManager')
export class StorageManager extends Component {
    private readonly UNLOCKED_LEVELS = 'unlockedLevels';
    private readonly COMPLETED_LEVELS = 'completedLevels';
    private readonly CURRENT_LEVEL = 'currentLevel';
    private readonly SETTINGS = 'settings';

    /**
     * 初始化存储
     */
    public init() {
        // 确保第一关默认解锁
        const unlocked = this.getUnlockedLevels();
        if (unlocked.length === 0) {
            this.setUnlockedLevels([1]);
        }
    }

    /**
     * 获取已解锁关卡列表
     */
    public getUnlockedLevels(): number[] {
        try {
            const data = sys.localStorage.getItem(this.UNLOCKED_LEVELS);
            return data ? JSON.parse(data) : [];
        } catch (e) {
            Logger.error('读取解锁关卡失败:', e);
            return [1];
        }
    }

    /**
     * 设置已解锁关卡列表
     */
    public setUnlockedLevels(levels: number[]) {
        try {
            sys.localStorage.setItem(this.UNLOCKED_LEVELS, JSON.stringify(levels));
        } catch (e) {
            Logger.error('保存解锁关卡失败:', e);
        }
    }

    /**
     * 解锁关卡
     */
    public unlockLevel(levelId: number) {
        const unlocked = this.getUnlockedLevels();
        if (!unlocked.includes(levelId)) {
            unlocked.push(levelId);
            this.setUnlockedLevels(unlocked);
        }
    }

    /**
     * 检查关卡是否已解锁
     */
    public isLevelUnlocked(levelId: number): boolean {
        return this.getUnlockedLevels().includes(levelId);
    }

    /**
     * 获取已完成关卡列表
     */
    public getCompletedLevels(): number[] {
        try {
            const data = sys.localStorage.getItem(this.COMPLETED_LEVELS);
            return data ? JSON.parse(data) : [];
        } catch (e) {
            Logger.error('读取完成关卡失败:', e);
            return [];
        }
    }

    /**
     * 设置已完成关卡列表
     */
    public setCompletedLevels(levels: number[]) {
        try {
            sys.localStorage.setItem(this.COMPLETED_LEVELS, JSON.stringify(levels));
        } catch (e) {
            Logger.error('保存完成关卡失败:', e);
        }
    }

    /**
     * 标记关卡为已完成
     */
    public completeLevel(levelId: number) {
        const completed = this.getCompletedLevels();
        if (!completed.includes(levelId)) {
            completed.push(levelId);
            this.setCompletedLevels(completed);
        }

        // 自动解锁下一关
        this.unlockLevel(levelId + 1);
    }

    /**
     * 检查关卡是否已完成
     */
    public isLevelCompleted(levelId: number): boolean {
        return this.getCompletedLevels().includes(levelId);
    }

    /**
     * 获取当前关卡
     */
    public getCurrentLevel(): number {
        try {
            const data = sys.localStorage.getItem(this.CURRENT_LEVEL);
            return data ? parseInt(data) : 1;
        } catch (e) {
            return 1;
        }
    }

    /**
     * 设置当前关卡
     */
    public setCurrentLevel(levelId: number) {
        try {
            sys.localStorage.setItem(this.CURRENT_LEVEL, levelId.toString());
        } catch (e) {
            Logger.error('保存当前关卡失败:', e);
        }
    }

    /**
     * 获取游戏设置
     */
    public getSettings(): { musicEnabled: boolean; soundEnabled: boolean } {
        try {
            const data = sys.localStorage.getItem(this.SETTINGS);
            return data ? JSON.parse(data) : {
                musicEnabled: true,
                soundEnabled: true
            };
        } catch (e) {
            return {
                musicEnabled: true,
                soundEnabled: true
            };
        }
    }

    /**
     * 保存游戏设置
     */
    public setSettings(settings: { musicEnabled: boolean; soundEnabled: boolean }) {
        try {
            sys.localStorage.setItem(this.SETTINGS, JSON.stringify(settings));
        } catch (e) {
            Logger.error('保存设置失败:', e);
        }
    }
}

