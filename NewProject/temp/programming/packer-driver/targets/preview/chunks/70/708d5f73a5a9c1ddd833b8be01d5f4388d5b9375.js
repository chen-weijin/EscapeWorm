System.register(["__unresolved_0", "cc", "__unresolved_1"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, AudioSource, AudioClip, resources, Logger, _dec, _dec2, _dec3, _class, _class2, _descriptor, _descriptor2, _crd, ccclass, property, AudioManager;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }

  function _reportPossibleCrUseOfLogger(extras) {
    _reporterNs.report("Logger", "../utils/Logger", _context.meta, extras);
  }

  return {
    setters: [function (_unresolved_) {
      _reporterNs = _unresolved_;
    }, function (_cc) {
      _cclegacy = _cc.cclegacy;
      __checkObsolete__ = _cc.__checkObsolete__;
      __checkObsoleteInNamespace__ = _cc.__checkObsoleteInNamespace__;
      _decorator = _cc._decorator;
      Component = _cc.Component;
      AudioSource = _cc.AudioSource;
      AudioClip = _cc.AudioClip;
      resources = _cc.resources;
    }, function (_unresolved_2) {
      Logger = _unresolved_2.Logger;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "2cef48LwWRFT7iDpmgnPFsj", "AudioManager", undefined);
      /**
       * 音频管理器
       */


      __checkObsolete__(['_decorator', 'Component', 'AudioSource', 'AudioClip', 'resources']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("AudioManager", AudioManager = (_dec = ccclass('AudioManager'), _dec2 = property(AudioSource), _dec3 = property(AudioSource), _dec(_class = (_class2 = class AudioManager extends Component {
        constructor() {
          super(...arguments);

          _initializerDefineProperty(this, "bgmSource", _descriptor, this);

          _initializerDefineProperty(this, "sfxSource", _descriptor2, this);

          this.soundEnabled = true;
          this.musicEnabled = true;
          this.sounds = new Map();
        }

        onLoad() {
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


        init(settings) {
          this.soundEnabled = settings.soundEnabled !== false;
          this.musicEnabled = settings.musicEnabled !== false;
        }
        /**
         * 播放背景音乐
         */


        playBackgroundMusic(clipPath) {
          if (!this.musicEnabled || !this.bgmSource) {
            return;
          }

          resources.load(clipPath, AudioClip, (err, clip) => {
            if (err) {
              (_crd && Logger === void 0 ? (_reportPossibleCrUseOfLogger({
                error: Error()
              }), Logger) : Logger).error('播放背景音乐失败:', err);
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


        stopBackgroundMusic() {
          if (this.bgmSource) {
            this.bgmSource.stop();
          }
        }
        /**
         * 暂停背景音乐
         */


        pauseBackgroundMusic() {
          if (this.bgmSource) {
            this.bgmSource.pause();
          }
        }
        /**
         * 恢复背景音乐
         */


        resumeBackgroundMusic() {
          if (this.bgmSource && this.musicEnabled) {
            this.bgmSource.play();
          }
        }
        /**
         * 播放音效
         */


        playSound(type, clipPath) {
          if (clipPath === void 0) {
            clipPath = null;
          }

          if (!this.soundEnabled || !this.sfxSource) {
            return;
          }

          var audioPath = clipPath || this.getDefaultSoundPath(type);

          if (!audioPath) {
            return;
          } // 检查缓存


          var cachedClip = this.sounds.get(audioPath);

          if (cachedClip) {
            this.sfxSource.playOneShot(cachedClip);
            return;
          } // 加载并播放


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


        getDefaultSoundPath(type) {
          // 暂时返回 null，后续可以添加音效文件
          return null;
        }
        /**
         * 设置音效开关
         */


        setSoundEnabled(enabled) {
          this.soundEnabled = enabled;
        }
        /**
         * 设置背景音乐开关
         */


        setMusicEnabled(enabled) {
          this.musicEnabled = enabled;

          if (!enabled) {
            this.stopBackgroundMusic();
          }
        }
        /**
         * 销毁所有音频资源
         */


        onDestroy() {
          this.stopBackgroundMusic();
          this.sounds.clear();
        }

      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "bgmSource", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "sfxSource", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      })), _class2)) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=708d5f73a5a9c1ddd833b8be01d5f4388d5b9375.js.map