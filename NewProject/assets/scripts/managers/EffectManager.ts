/**
 * 特效管理器
 * 管理粒子特效和动画效果
 */
import { _decorator, Component, Node, Vec3, Color, Graphics, UITransform, tween } from 'cc';
const { ccclass, property } = _decorator;

interface Particle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    color: string;
    life: number;
    decay: number;
    size: number;
}

@ccclass('EffectManager')
export class EffectManager extends Component {
    private particles: Particle[] = [];
    private graphics: Graphics | null = null;

    protected onLoad() {
        // 创建 Graphics 组件用于绘制粒子
        this.graphics = this.getComponent(Graphics) || this.addComponent(Graphics);
    }

    /**
     * 创建逃脱粒子特效
     */
    public createEscapeEffect(position: Vec3, color: string) {
        const particleCount = 20;
        for (let i = 0; i < particleCount; i++) {
            const angle = (Math.PI * 2 * i) / particleCount;
            const speed = 2 + Math.random() * 3;
            this.particles.push({
                x: position.x,
                y: position.y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                color: color,
                life: 1.0,
                decay: 0.02 + Math.random() * 0.02,
                size: 3 + Math.random() * 3
            });
        }
    }

    /**
     * 创建胜利粒子特效
     */
    public createVictoryEffect(center: Vec3) {
        const particleCount = 50;
        const colors = ['#FFD700', '#FF6B6B', '#4ECDC4', '#95E1D3', '#F38181'];
        for (let i = 0; i < particleCount; i++) {
            const angle = (Math.PI * 2 * i) / particleCount;
            const speed = 3 + Math.random() * 4;
            this.particles.push({
                x: center.x,
                y: center.y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                color: colors[Math.floor(Math.random() * colors.length)],
                life: 1.0,
                decay: 0.015 + Math.random() * 0.01,
                size: 4 + Math.random() * 4
            });
        }
    }

    /**
     * 创建高亮警示动画
     */
    public createHighlightAnimation(targetNode: Node, callback?: () => void): Promise<void> {
        return new Promise((resolve) => {
            let flashCount = 0;
            const maxFlashes = 6;
            const flashInterval = 100;

            const flash = () => {
                const isHighlighted = flashCount % 2 === 0;
                // 通过改变节点透明度实现闪烁
                targetNode.getChildByName('HighlightOverlay')?.setScale(isHighlighted ? 1 : 0, 1, 1);
                flashCount++;

                if (flashCount < maxFlashes) {
                    setTimeout(flash, flashInterval);
                } else {
                    if (callback) callback();
                    resolve();
                }
            };

            flash();
        });
    }

    /**
     * 更新所有粒子
     */
    protected update(dt: number) {
        if (!this.graphics) return;

        // 清空之前的绘制
        this.graphics.clear();

        // 更新并绘制粒子
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const particle = this.particles[i];

            // 更新位置
            particle.x += particle.vx;
            particle.y += particle.vy;

            // 更新生命周期
            particle.life -= particle.decay;

            // 移除死亡粒子
            if (particle.life <= 0) {
                this.particles.splice(i, 1);
                continue;
            }

            // 绘制粒子
            this.drawParticle(particle);
        }
    }

    /**
     * 绘制单个粒子
     */
    private drawParticle(particle: Particle) {
        if (!this.graphics) return;

        const color = this.hexToColor(particle.color, particle.life);
        this.graphics.fillColor = color;
        this.graphics.circle(particle.x, particle.y, particle.size);
        this.graphics.fill();
    }

    /**
     * 将十六进制颜色转换为 Color 对象
     */
    private hexToColor(hex: string, alpha: number = 1): Color {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        if (result) {
            return new Color(
                parseInt(result[1], 16),
                parseInt(result[2], 16),
                parseInt(result[3], 16),
                Math.floor(alpha * 255)
            );
        }
        return new Color(255, 255, 255, Math.floor(alpha * 255));
    }

    /**
     * 清除所有特效
     */
    public clear() {
        this.particles = [];
        if (this.graphics) {
            this.graphics.clear();
        }
    }
}

