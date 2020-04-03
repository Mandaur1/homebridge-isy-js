/**
 * Logger class
 */

declare module 'homebridge/lib/logger'
{

export  class Logger {
    prefix: string;
    constructor(prefix?: string);
    debug(...args: any[]): void;
    info(...args: any[]): void;
    warn(...args: any[]): void;
    error(...args: any[]): void;
    log(level: any, msg: any): void;
    static withPrefix(prefix: string): { (...args: any[]): void; debug: (...args: any[]) => void; info: (...args: any[]) => void; warn: (...args: any[]) => void; error: (...args: any[]) => void; log: (level: string, msg: unknown) => void; prefix: string; };

}

export  function setDebugEnabled(enabled: any): void;
export  const _system: Logger;
export  function setTimestampEnabled(timestamp: any): void;
export  function forceColor(): void;
export  const loggerCache: {};
}