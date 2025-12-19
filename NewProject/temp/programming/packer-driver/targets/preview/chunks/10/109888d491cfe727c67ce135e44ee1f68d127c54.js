System.register(["cc"], function (_export, _context) {
  "use strict";

  var _cclegacy, Logger, _crd, ENABLE_LOG;

  _export("Logger", void 0);

  return {
    setters: [function (_cc) {
      _cclegacy = _cc.cclegacy;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "e5596UfsK1M0qisYxXAR8oI", "Logger", undefined);

      /**
       * 日志控制工具类
       * 可以通过 ENABLE_LOG 开关控制是否输出日志
       */
      ENABLE_LOG = false; // 设置为 false 屏蔽所有日志

      _export("Logger", Logger = class Logger {
        static log() {
          if (ENABLE_LOG) {
            console.log(...arguments);
          }
        }

        static warn() {
          if (ENABLE_LOG) {
            console.warn(...arguments);
          }
        }

        static error() {
          if (ENABLE_LOG) {
            console.error(...arguments);
          }
        }

        static info() {
          if (ENABLE_LOG) {
            console.info(...arguments);
          }
        }

        static debug() {
          if (ENABLE_LOG) {
            console.debug(...arguments);
          }
        }

      });

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=109888d491cfe727c67ce135e44ee1f68d127c54.js.map