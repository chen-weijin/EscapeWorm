/**
 * 蠕虫实体类
 */
import { _decorator, Component, Node, Vec2, Vec3, Sprite, SpriteFrame, Color, tween, UITransform } from 'cc';
import { Logger } from '../utils/Logger';
const { ccclass, property } = _decorator;

export interface WormConfig {
    id: number;
    segments: { x: number; y: number }[];
    direction: string;
    color: string;
}

@ccclass('Worm')
export class Worm extends Component {
    @property
    public id: number = 0;

    @property
    public color: string = '#FF5733';

    @property
    public direction: string = 'right';

    // 身体段坐标数组
    public segments: Vec2[] = [];
    public originalSegments: Vec2[] = [];
    public previousSegments: Vec2[] = [];

    // 状态
    public isEscaped: boolean = false;
    public isHighlighted: boolean = false;
    public isEscaping: boolean = false;
    public isAnimating: boolean = false;

    // 显示相关
    public visibleSegmentCount: number = 0;

    // 动画相关
    public animationProgress: number = 1.0;
    public animationDuration: number = 10;
    public animationStartTime: number = 0;

    // 节点引用
    private segmentNodes: Node[] = [];

    /**
     * 初始化蠕虫
     */
    public init(config: WormConfig) {
        this.id = config.id;
        this.color = config.color;

        // 深拷贝原始位置
        this.originalSegments = config.segments.map(s => new Vec2(s.x, s.y));
        this.segments = config.segments.map(s => new Vec2(s.x, s.y));
        this.previousSegments = config.segments.map(s => new Vec2(s.x, s.y));

        // 计算方向
        if (config.direction && ['up', 'down', 'left', 'right'].indexOf(config.direction) !== -1) {
            this.direction = config.direction;
        } else if (this.segments.length >= 2) {
            const first = this.segments[0];
            const second = this.segments[1];
            const dx = second.x - first.x;
            const dy = second.y - first.y;

            let bodyDirection: string | null = null;
            if (dx > 0) bodyDirection = 'right';
            else if (dx < 0) bodyDirection = 'left';
            else if (dy > 0) bodyDirection = 'down';
            else if (dy < 0) bodyDirection = 'up';

            const oppositeDirection: { [key: string]: string } = {
                'right': 'left',
                'left': 'right',
                'up': 'down',
                'down': 'up'
            };

            this.direction = bodyDirection ? oppositeDirection[bodyDirection] : 'right';
        }

        this.visibleSegmentCount = this.segments.length;
    }

    /**
     * 获取头部位置
     */
    public getHeadPosition(): Vec2 {
        return this.segments[0];
    }

    /**
     * 获取身体段位置（不包括头部）
     */
    public getBodySegments(): Vec2[] {
        return this.segments.slice(1);
    }

    /**
     * 获取所有段位置
     */
    public getAllSegments(): Vec2[] {
        return this.segments;
    }

    /**
     * 获取插值后的段位置（用于平滑渲染）
     */
    public getInterpolatedSegments(progress: number | null = null): Vec2[] {
        if (progress === null) {
            progress = this.animationProgress;
        }

        if (progress >= 1.0 || !this.isAnimating) {
            return this.segments;
        }

        const interpolated: Vec2[] = [];
        for (let i = 0; i < this.segments.length; i++) {
            const prevSeg = this.previousSegments[i] || this.segments[i];
            const currSeg = this.segments[i];

            interpolated.push(new Vec2(
                prevSeg.x + (currSeg.x - prevSeg.x) * progress,
                prevSeg.y + (currSeg.y - prevSeg.y) * progress
            ));
        }

        return interpolated;
    }

    /**
     * 开始移动动画
     */
    public startMoveAnimation(newHeadPosition: Vec2, duration: number = 40): Promise<void> {
        return new Promise((resolve, reject) => {
            try {
                if (this.isEscaped) {
                    Logger.log(`蠕虫 ${this.id} 已逃脱，跳过动画`);
                    resolve();
                    return;
                }

                Logger.log(`蠕虫 ${this.id} 开始移动动画: 从 (${this.segments[0]?.x}, ${this.segments[0]?.y}) 到 (${newHeadPosition.x}, ${newHeadPosition.y}), 持续时间=${duration}ms`);

                // 保存当前位置作为动画起始位置
                this.previousSegments = this.segments.map(s => new Vec2(s.x, s.y));

                // 新头部在开头
                const newSegments: Vec2[] = [newHeadPosition];

                // 身体段跟随
                for (let i = 0; i < this.segments.length - 1; i++) {
                    newSegments.push(new Vec2(this.segments[i].x, this.segments[i].y));
                }

                this.segments = newSegments;

                // 开始动画
                this.animationProgress = 0;
                this.isAnimating = true;
                this.animationDuration = duration;
                this.animationStartTime = Date.now();

                // 使用 setTimeout 模拟动画完成
                setTimeout(() => {
                    try {
                       // Logger.log(`蠕虫 ${this.id} 动画完成回调执行`);
                        this.completeAnimation();
                        //Logger.log(`蠕虫 ${this.id} 动画完成，resolve`);
                        resolve();
                    } catch (error) {
                        Logger.error(`蠕虫 ${this.id} 动画完成回调中发生错误:`, error);
                        reject(error);
                    }
                }, duration);
            } catch (error) {
                Logger.error(`蠕虫 ${this.id} startMoveAnimation 中发生错误:`, error);
                reject(error);
            }
        });
    }

    /**
     * 更新动画进度
     */
    public updateAnimation(currentTime: number): boolean {
        if (!this.isAnimating) {
            return true;
        }

        const elapsed = currentTime - this.animationStartTime;
        this.animationProgress = Math.min(elapsed / this.animationDuration, 1.0);

        if (this.animationProgress >= 1.0) {
            this.isAnimating = false;
            return true;
        }

        return false;
    }

    /**
     * 立即完成动画
     */
    public completeAnimation() {
        this.animationProgress = 1.0;
        this.isAnimating = false;
        this.previousSegments = this.segments.map(s => new Vec2(s.x, s.y));
    }

    /**
     * 移动蠕虫到新位置（立即移动，不使用动画）
     */
    public moveTo(newHeadPosition: Vec2) {
        if (this.isEscaped) {
            return;
        }

        const newSegments: Vec2[] = [newHeadPosition];
        for (let i = 0; i < this.segments.length - 1; i++) {
            newSegments.push(new Vec2(this.segments[i].x, this.segments[i].y));
        }

        this.segments = newSegments;
        this.previousSegments = this.segments.map(s => new Vec2(s.x, s.y));
        this.isAnimating = false;
        this.animationProgress = 1.0;
    }

    /**
     * 复位到原始位置
     */
    public reset() {
        //Logger.log(`蠕虫 ${this.id} reset: 原始位置数量=${this.originalSegments.length}`);
        
        // 验证原始位置数据
        if (this.originalSegments.length === 0) {
            Logger.error(`错误：蠕虫 ${this.id} 的 originalSegments 为空！无法重置！`);
            return;
        }
        
        this.segments = this.originalSegments.map(s => new Vec2(s.x, s.y));
        this.previousSegments = this.originalSegments.map(s => new Vec2(s.x, s.y));
        this.isEscaped = false;
        this.isHighlighted = false;
        this.isAnimating = false;
        this.isEscaping = false;
        this.animationProgress = 1.0;
        this.visibleSegmentCount = this.segments.length;
        
        // 验证重置后的数据
        if (this.segments.length === 0) {
            Logger.error(`错误：蠕虫 ${this.id} reset 后 segments 为空！`);
        }
        if (this.visibleSegmentCount === 0) {
            Logger.error(`错误：蠕虫 ${this.id} reset 后 visibleSegmentCount=0！`);
        }
        
       // Logger.log(`蠕虫 ${this.id} reset完成: segments=${this.segments.length}, visibleCount=${this.visibleSegmentCount}, 头部=(${this.segments[0]?.x}, ${this.segments[0]?.y})`);
    }

    /**
     * 设置可见段数量
     */
    public setVisibleSegmentCount(count: number) {
        this.visibleSegmentCount = Math.max(0, Math.min(count, this.segments.length));
    }

    /**
     * 获取可见的段
     */
    public getVisibleSegments(): Vec2[] {
        if (this.visibleSegmentCount >= this.segments.length) {
            return this.segments;
        }
        return this.segments.slice(-this.visibleSegmentCount);
    }

    /**
     * 设置高亮状态
     */
    public setHighlighted(highlighted: boolean) {
        this.isHighlighted = highlighted;
    }

    /**
     * 标记为已逃脱
     */
    public markEscaped() {
        this.isEscaped = true;
    }

    /**
     * 检查蠕虫是否已逃脱
     */
    public hasEscaped(): boolean {
        return this.isEscaped;
    }

    /**
     * 获取蠕虫长度
     */
    public getLength(): number {
        return this.segments.length;
    }

    /**
     * 获取蠕虫配置
     */
    public getConfig(): WormConfig {
        return {
            id: this.id,
            segments: this.segments.map(s => ({ x: s.x, y: s.y })),
            direction: this.direction,
            color: this.color
        };
    }
}

