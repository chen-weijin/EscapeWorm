/**
 * 音频管理器
 */
class AudioManager {
  constructor() {
    this.backgroundMusic = null;
    this.soundEnabled = true;
    this.musicEnabled = true;
    this.sounds = {}; // 音效缓存
  }

  /**
   * 初始化音频管理器
   * @param {Object} storageManager - 存储管理器
   */
  init(storageManager) {
    const settings = storageManager.getSettings();
    this.soundEnabled = settings.soundEnabled !== false;
    this.musicEnabled = settings.musicEnabled !== false;
  }

  /**
   * 播放背景音乐
   * @param {string} src - 音频文件路径
   */
  playBackgroundMusic(src) {
    if (!this.musicEnabled) {
      return;
    }

    try {
      if (this.backgroundMusic) {
        this.backgroundMusic.stop();
      }

      this.backgroundMusic = wx.createInnerAudioContext();
      this.backgroundMusic.src = src;
      this.backgroundMusic.loop = true;
      this.backgroundMusic.volume = 0.5;
      this.backgroundMusic.play();
    } catch (e) {
      console.error('播放背景音乐失败:', e);
    }
  }

  /**
   * 停止背景音乐
   */
  stopBackgroundMusic() {
    if (this.backgroundMusic) {
      this.backgroundMusic.stop();
      this.backgroundMusic = null;
    }
  }

  /**
   * 暂停背景音乐
   */
  pauseBackgroundMusic() {
    if (this.backgroundMusic) {
      this.backgroundMusic.pause();
    }
  }

  /**
   * 恢复背景音乐
   */
  resumeBackgroundMusic() {
    if (this.backgroundMusic && this.musicEnabled) {
      this.backgroundMusic.play();
    }
  }

  /**
   * 播放音效
   * @param {string} type - 音效类型 (click/move/collision/escape/victory/fail)
   * @param {string} src - 音频文件路径（可选，如果不提供则使用默认路径）
   */
  playSound(type, src = null) {
    if (!this.soundEnabled) {
      return;
    }

    try {
      // 如果提供了src，使用提供的路径
      const audioSrc = src || this.getDefaultSoundPath(type);
      if (!audioSrc) {
        return;
      }

      // 创建音频上下文
      const audio = wx.createInnerAudioContext();
      
      // 先监听错误，避免文件不存在时报错
      audio.onError((err) => {
        // 静默处理音频加载错误（文件不存在时）
        // 不输出错误，避免控制台噪音
        try {
          audio.destroy();
        } catch (e) {
          // 忽略销毁错误
        }
      });
      
      audio.src = audioSrc;
      audio.volume = 0.7;
      
      // 尝试播放，如果失败会被 onError 捕获
      audio.play();

      // 播放完成后销毁
      audio.onEnded(() => {
        try {
          audio.destroy();
        } catch (e) {
          // 忽略销毁错误
        }
      });
    } catch (e) {
      // 静默处理所有错误，不输出到控制台
      // 音频文件不存在不影响游戏运行
    }
  }

  /**
   * 获取默认音效路径
   * @param {string} type - 音效类型
   * @returns {string|null}
   */
  getDefaultSoundPath(type) {
    // 暂时返回 null，避免文件不存在的错误
    // 如果需要音效，请确保 audio 目录存在并包含相应的音频文件
    // 然后取消下面的注释并注释掉 return null
    return null;
    
    /*
    const soundMap = {
      'click': 'audio/click.mp3',
      'move': 'audio/move.mp3',
      'collision': 'audio/collision.mp3',
      'escape': 'audio/escape.mp3',
      'victory': 'audio/victory.mp3',
      'fail': 'audio/fail.mp3'
    };
    return soundMap[type] || null;
    */
  }

  /**
   * 设置音效开关
   * @param {boolean} enabled
   */
  setSoundEnabled(enabled) {
    this.soundEnabled = enabled;
  }

  /**
   * 设置背景音乐开关
   * @param {boolean} enabled
   */
  setMusicEnabled(enabled) {
    this.musicEnabled = enabled;
    if (!enabled) {
      this.stopBackgroundMusic();
    } else if (this.backgroundMusic) {
      this.resumeBackgroundMusic();
    }
  }

  /**
   * 销毁所有音频资源
   */
  destroy() {
    this.stopBackgroundMusic();
    // 清理音效缓存
    for (const key in this.sounds) {
      if (this.sounds[key]) {
        this.sounds[key].destroy();
      }
    }
    this.sounds = {};
  }
}

module.exports = AudioManager;

