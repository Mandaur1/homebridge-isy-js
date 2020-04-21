import { API, DynamicPlatformPlugin } from 'homebridge';
import { Logging } from 'homebridge/lib/logger';
import { PlatformAccessory } from 'homebridge/lib/platformAccessory';
import { ISY, ISYDevice, ISYNode } from 'isy-nodejs';
import { IgnoreDeviceRule, PlatformConfig } from '../typings/config';
import { ISYAccessory } from './ISYAccessory';
import './utils';
export declare class ISYPlatform implements DynamicPlatformPlugin {
    log: Logging;
    config: PlatformConfig;
    host: string;
    username: string;
    password: string;
    elkEnabled: boolean;
    debugLoggingEnabled: boolean;
    includeAllScenes: boolean;
    includedScenes: [];
    ignoreRules: IgnoreDeviceRule[];
    homebridge: API;
    static Instance: ISYPlatform;
    accessories: PlatformAccessory[];
    accessoriesWrappers: Map<string, ISYAccessory<any, any>>;
    accessoriesToRegister: PlatformAccessory[];
    accessoriesToConfigure: Map<string, PlatformAccessory>;
    isy: ISY;
    constructor(log: Logging, config: PlatformConfig, homebridge: API);
    logger(msg: string): void;
    shouldIgnore(device: ISYNode): boolean;
    getGarageEntry(address: string): any;
    renameDeviceIfNeeded(device: ISYNode): string;
    configureAccessory(accessory: PlatformAccessory): boolean;
    createAccessories(): Promise<void>;
    createAccessory(device: ISYDevice<any>): ISYAccessory<any, any>;
}
//# sourceMappingURL=ISYPlatform.d.ts.map