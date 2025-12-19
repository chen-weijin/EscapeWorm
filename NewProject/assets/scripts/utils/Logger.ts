/**
 * 日志控制工具类
 * 可以通过 ENABLE_LOG 开关控制是否输出日志
 */
const ENABLE_LOG = false; // 设置为 false 屏蔽所有日志

export class Logger {
    static log(...args: any[]): void {
        if (ENABLE_LOG) {
            console.log(...args);
        }
    }

    static warn(...args: any[]): void {
        if (ENABLE_LOG) {
            console.warn(...args);
        }
    }

    static error(...args: any[]): void {
        if (ENABLE_LOG) {
            console.error(...args);
        }
    }

    static info(...args: any[]): void {
        if (ENABLE_LOG) {
            console.info(...args);
        }
    }

    static debug(...args: any[]): void {
        if (ENABLE_LOG) {
            console.debug(...args);
        }
    }
}

