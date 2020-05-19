import * as log4js from '@log4js-node/log4js-api';
import { CharacteristicGetCallback, CharacteristicSetCallback, CharacteristicValue, Service, WithUUID } from 'hap-nodejs';
import * as HB from 'homebridge';
import { Logging } from 'homebridge/lib/logger';
import { ISYNode } from 'isy-nodejs';
import { DeviceFilterRule, PlatformConfig } from 'typings/config';
export declare const didFinishLaunching: symbol;
export declare let Hap: any;
declare global {
    interface Promise<T> {
        handleWith(callback: (...arg: any) => void): Promise<void>;
    }
}
export declare function isMatch(device: ISYNode, filter: DeviceFilterRule): boolean;
export declare function cleanConfig(config: PlatformConfig): PlatformConfig;
export declare function onSet<T extends CharacteristicValue>(character: HB.Characteristic, func: (arg: T) => Promise<any>): HB.Characteristic;
export declare function toCelsius(temp: number): any;
export declare function toFahrenheit(temp: number): any;
export declare function onGet<T extends CharacteristicValue>(character: HB.Characteristic, func: () => T): HB.Characteristic;
export interface LoggerLike extends Partial<log4js.Logger> {
    prefix?: string;
    (msg: any): void;
    default(msg: any): void;
}
declare module 'homebridge/lib/platformAccessory' {
    interface PlatformAccessory {
        getOrAddService<T extends WithUUID<typeof Service>>(service: T): Service;
    }
}
declare module 'homebridge/lib/logger' {
    interface Logger extends LoggerLike {
    }
    interface Logging extends LoggerLike {
    }
}
declare module 'hap-nodejs/dist/lib/Characteristic' {
    interface Characteristic {
        onSet<T extends CharacteristicValue>(func: (...args: any) => Promise<T>): HB.Characteristic;
        onGet<T extends CharacteristicValue>(func: () => T): HB.Characteristic;
    }
}
export declare function clone(logger: Logging, prefix: string): Logging;
export declare function wire(logger: Logging): void;
export declare function addGetCallback<T extends CharacteristicValue>(func: (...args: any[]) => Promise<T>): (arg: any, cb: CharacteristicGetCallback) => void;
export declare function addSetCallback<T extends CharacteristicValue>(func: (...args: any[]) => Promise<T>): (arg: any, cb: CharacteristicSetCallback) => void;
export declare function addCallback<T>(func: (...args: any[]) => Promise<T>): (arg: any, cb: CharacteristicSetCallback) => void;
//# sourceMappingURL=utils.d.ts.map