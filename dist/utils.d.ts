import * as log4js from '@log4js-node/log4js-api';
import { CharacteristicGetCallback, CharacteristicSetCallback, CharacteristicValue, Service, WithUUID } from 'hap-nodejs';
import { Characteristic } from 'hap-nodejs/dist/lib/Characteristic';
export declare const didFinishLaunching: symbol;
export declare let Hap: any;
declare global {
    interface Promise<T> {
        handleWith(callback: (...arg: any) => void): Promise<void>;
    }
}
export declare function onSet<T extends CharacteristicValue>(character: Characteristic, func: (arg: T) => Promise<any>): Characteristic;
export declare function toCelsius(temp: number): any;
export declare function toFahrenheit(temp: number): any;
export declare function onGet<T extends CharacteristicValue>(character: Characteristic, func: () => T): Characteristic;
export interface LoggerLike extends Partial<log4js.Logger> {
    prefix?: string;
    (msg: any): void;
    default(msg: any): void;
}
declare module 'homebridge/lib/platformAccessory' {
    interface PlatformAccessory {
        getOrAddService(service: WithUUID<typeof Service>): Service;
    }
}
declare module 'homebridge/lib/logger' {
    interface Logger extends LoggerLike {
    }
}
declare module 'hap-nodejs/dist/lib/Characteristic' {
    interface Characteristic {
        onSet<T extends CharacteristicValue>(func: (...args: any) => Promise<T>): Characteristic;
        onGet<T extends CharacteristicValue>(func: () => T): Characteristic;
    }
}
export declare function addGetCallback<T extends CharacteristicValue>(func: (...args: any[]) => Promise<T>): (arg: any, cb: CharacteristicGetCallback) => void;
export declare function addSetCallback<T extends CharacteristicValue>(func: (...args: any[]) => Promise<T>): (arg: any, cb: CharacteristicSetCallback) => void;
export declare function addCallback<T>(func: (...args: any[]) => Promise<T>): (arg: any, cb: CharacteristicSetCallback) => void;
//# sourceMappingURL=utils.d.ts.map