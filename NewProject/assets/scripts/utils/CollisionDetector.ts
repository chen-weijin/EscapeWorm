/**
 * 碰撞检测工具类
 */
import { Vec2 } from 'cc';
import { PathFinder } from './PathFinder';

export interface WormLike {
    id: number;
    segments: Vec2[];
    direction: string;
    isEscaped: boolean;
    isEscaping: boolean;
    isAnimating: boolean;
}

export class CollisionDetector {
    /**
     * 检测蠕虫移动到新位置是否会碰撞
     */
    static checkCollision(worm: WormLike, newPosition: Vec2, allWorms: WormLike[]): boolean {
        for (const otherWorm of allWorms) {
            // 跳过自己
            if (otherWorm.id === worm.id) {
                continue;
            }

            // 跳过已逃脱的蠕虫
            if (otherWorm.isEscaped) {
                continue;
            }

            // 跳过正在逃脱的蠕虫
            if (otherWorm.isEscaping) {
                continue;
            }

            // 跳过正在移动的蠕虫
            if (otherWorm.isAnimating) {
                continue;
            }

            // 检查新位置是否与其他蠕虫的任何段重叠
            for (const segment of otherWorm.segments) {
                if (segment.x === newPosition.x && segment.y === newPosition.y) {
                    return true;
                }
            }
        }

        return false;
    }

    /**
     * 预测蠕虫下一步是否会碰撞
     */
    static willCollide(worm: WormLike, allWorms: WormLike[]): boolean {
        const headPos = worm.segments[0];
        const direction = PathFinder.getDirectionVector(worm.direction);
        const nextPosition = new Vec2(headPos.x + direction.x, headPos.y + direction.y);

        return this.checkCollision(worm, nextPosition, allWorms);
    }

    /**
     * 检查位置是否在矩阵范围内
     */
    static isInBounds(position: Vec2, matrixWidth: number, matrixHeight: number): boolean {
        return position.x >= 0 && position.x < matrixWidth &&
            position.y >= 0 && position.y < matrixHeight;
    }

    /**
     * 检查位置是否与其他蠕虫的任何部分重叠
     */
    static isPositionOccupied(position: Vec2, allWorms: WormLike[], excludeWormId: number | null = null): boolean {
        for (const worm of allWorms) {
            if (excludeWormId !== null && worm.id === excludeWormId) {
                continue;
            }

            for (const segment of worm.segments) {
                if (segment.x === position.x && segment.y === position.y) {
                    return true;
                }
            }
        }
        return false;
    }
}

