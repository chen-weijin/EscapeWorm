/**
 * 关卡管理器
 */
import { _decorator, Component, resources, JsonAsset } from 'cc';
import { Logger } from '../utils/Logger';
const { ccclass, property } = _decorator;

export interface LevelData {
    levelId: number;
    matrix: {
        width: number;
        height: number;
    };
    escapePoints: { x: number; y: number }[];
    worms: {
        id: number;
        segments: { x: number; y: number }[];
        direction: string;
        color: string;
    }[];
}

@ccclass('LevelManager')
export class LevelManager extends Component {
    private currentLevel: number | null = null;
    private currentLevelData: LevelData | null = null;
    private levelsPath: string = 'levels/';

    /**
     * 加载关卡配置
     */
    public loadLevel(levelId: number): Promise<LevelData> {
        return new Promise((resolve, reject) => {
            const filePath = `${this.levelsPath}level${levelId}`;

            resources.load(filePath, JsonAsset, (err, jsonAsset) => {
                if (err) {
                    Logger.error('加载关卡失败:', err);
                    reject(new Error('加载关卡失败: ' + err.message));
                    return;
                }

                try {
                    const levelData = jsonAsset.json as LevelData;

                    if (this.validateLevelData(levelData)) {
                        this.currentLevel = levelId;
                        this.currentLevelData = levelData;
                        resolve(levelData);
                    } else {
                        Logger.error('关卡数据验证失败:', levelId);
                        reject(new Error('关卡数据验证失败'));
                    }
                } catch (e) {
                    Logger.error('关卡数据解析失败:', e);
                    reject(new Error('关卡数据解析失败'));
                }
            });
        });
    }

    /**
     * 验证关卡数据
     */
    private validateLevelData(levelData: any): boolean {
        if (!levelData.levelId || !levelData.matrix || !levelData.worms || !levelData.escapePoints) {
            return false;
        }

        if (!levelData.matrix.width || !levelData.matrix.height) {
            return false;
        }

        if (!Array.isArray(levelData.worms) || levelData.worms.length === 0) {
            return false;
        }

        if (!Array.isArray(levelData.escapePoints) || levelData.escapePoints.length === 0) {
            return false;
        }

        // 验证蠕虫数据
        for (const worm of levelData.worms) {
            if (!worm.id || !worm.segments || !worm.direction || !worm.color) {
                return false;
            }
            if (!Array.isArray(worm.segments) || worm.segments.length < 2) {
                return false;
            }
            // 验证坐标范围
            for (const segment of worm.segments) {
                if (segment.x < 0 || segment.x >= levelData.matrix.width ||
                    segment.y < 0 || segment.y >= levelData.matrix.height) {
                    return false;
                }
            }
        }

        return true;
    }

    /**
     * 获取当前关卡数据
     */
    public getCurrentLevelData(): LevelData | null {
        return this.currentLevelData;
    }

    /**
     * 获取当前关卡ID
     */
    public getCurrentLevelId(): number | null {
        return this.currentLevel;
    }

    /**
     * 获取关卡总数
     */
    public getTotalLevels(): number {
        return 3; // 默认3关
    }
}

