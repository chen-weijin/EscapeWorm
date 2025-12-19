/**
 * 音频管理器
 */
import { _decorator, Component, AudioSource, AudioClip, resources } from 'cc';
import { Logger } from '../utils/Logger';
const { ccclass, property } = _decorator;

@ccclass('AudioManager')
export class AudioManager extends Component {
    @property(AudioSource)
    public bgmSource: AudioSource | null = null;

    @property(AudioSource)
    public sfxSource: AudioSource | null = null;

    private soundEnabled: boolean = true;
    private musicEnabled: boolean = true;
    private sounds: Map<string, AudioClip> = new Map();

    protected onLoad() {
        // 创建音频源组件
        if (!this.bgmSource) {
            this.bgmSource = this.addComponent(AudioSource);
            if (this.bgmSource) {
                this.bgmSource.loop = true;
                this.bgmSource.volume = 0.5;
            }
        }
        if (!this.sfxSource) {
            this.sfxSource = this.addComponent(AudioSource);
            if (this.sfxSource) {
                this.sfxSource.loop = false;
                this.sfxSource.volume = 0.7;
            }
        }
    }

    /**
     * 初始化音频管理器
     */
    public init(settings: { musicEnabled: boolean; soundEnabled: boolean }) {
        this.soundEnabled = settings.soundEnabled !== false;
        this.musicEnabled = settings.musicEnabled !== false;
    }

    /**
     * 播放背景音乐
     */
    public playBackgroundMusic(clipPath: string) {
        if (!this.musicEnabled || !this.bgmSource) {
            return;
        }

        resources.load(clipPath, AudioClip, (err, clip) => {
            if (err) {
                Logger.error('播放背景音乐失败:', err);
                return;
            }
            if (this.bgmSource) {
                this.bgmSource.clip = clip;
                this.bgmSource.play();
            }
        });
    }

    /**
     * 停止背景音乐
     */
    public stopBackgroundMusic() {
        if (this.bgmSource) {
            this.bgmSource.stop();
        }
    }

    /**
     * 暂停背景音乐
     */
    public pauseBackgroundMusic() {
        if (this.bgmSource) {
            this.bgmSource.pause();
        }
    }

    /**
     * 恢复背景音乐
     */
    public resumeBackgroundMusic() {
        if (this.bgmSource && this.musicEnabled) {
            this.bgmSource.play();
        }
    }

    /**
     * 播放音效
     */
    public playSound(type: string, clipPath: string | null = null) {
        if (!this.soundEnabled || !this.sfxSource) {
            return;
        }

        const audioPath = clipPath || this.getDefaultSoundPath(type);
        if (!audioPath) {
            return;
        }

        // 检查缓存
        const cachedClip = this.sounds.get(audioPath);
        if (cachedClip) {
            this.sfxSource.playOneShot(cachedClip);
            return;
        }

        // 加载并播放
        resources.load(audioPath, AudioClip, (err, clip) => {
            if (err) {
                // 静默处理错误
                return;
            }
            this.sounds.set(audioPath, clip);
            if (this.sfxSource) {
                this.sfxSource.playOneShot(clip);
            }
        });
    }

    /**
     * 获取默认音效路径
     */
    private getDefaultSoundPath(type: string): string | null {
        // 暂时返回 null，后续可以添加音效文件
        return null;
    }

    /**
     * 设置音效开关
     */
    public setSoundEnabled(enabled: boolean) {
        this.soundEnabled = enabled;
    }

    /**
     * 设置背景音乐开关
     */
    public setMusicEnabled(enabled: boolean) {
        this.musicEnabled = enabled;
        if (!enabled) {
            this.stopBackgroundMusic();
        }
    }

    /**
     * 销毁所有音频资源
     */
    protected onDestroy() {
        this.stopBackgroundMusic();
        this.sounds.clear();
    }
}

