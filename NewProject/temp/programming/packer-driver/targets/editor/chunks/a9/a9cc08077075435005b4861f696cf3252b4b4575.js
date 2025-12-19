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
        static log(...args) {
          if (ENABLE_LOG) {
            console.log(...args);
          }
        }

        static warn(...args) {
          if (ENABLE_LOG) {
            console.warn(...args);
          }
        }

        static error(...args) {
          if (ENABLE_LOG) {
            console.error(...args);
          }
        }

        static info(...args) {
          if (ENABLE_LOG) {
            console.info(...args);
          }
        }

        static debug(...args) {
          if (ENABLE_LOG) {
            console.debug(...args);
          }
        }

      });

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=a9cc08077075435005b4861f696cf3252b4b4575.js.map