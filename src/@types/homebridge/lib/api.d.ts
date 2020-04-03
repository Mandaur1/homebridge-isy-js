/// <reference types="node" />

declare module 'homebridge'
{
    import { EventEmitter } from 'events';
    import * as hap from 'hap-nodejs';
    import { Types as hapLegacyTypes } from 'hap-nodejs';
    import { PlatformAccessory } from 'homebridge/lib/platformAccessory';
    import { User } from 'homebridge/lib/user';
    import * as serverVersion from 'homebridge/lib/version';

    export class API extends EventEmitter {
        private _accessories;
        private _platforms;
        private _configurableAccessories;
        private _dynamicPlatforms;
        protected readonly version = 2.4;
        protected serverVersion:  any;
        protected user: typeof User;
        protected hap: typeof hap;
        public hapLegacyTypes: hapLegacyTypes;
        public platformAccessory: typeof PlatformAccessory;
        


        constructor ();
        accessory(name: string): any;
        registerAccessory(pluginName: string, accessoryName: string, constructor: any, configurationRequestHandler: any): void;
        publishCameraAccessories(pluginName: string, accessories: PlatformAccessory[]): void;
        publishExternalAccessories(pluginName: string, accessories: PlatformAccessory[]): void;
        platform(name: string): any;
        registerPlatform(pluginName: string, platformName: string, constructor: any, dynamic: boolean): void;
        registerPlatformAccessories(pluginName: string, platformName: string, accessories: PlatformAccessory[]): void;
        updatePlatformAccessories(accessories: PlatformAccessory[]): void;
        unregisterPlatformAccessories(pluginName: string, platformName: string, accessories: PlatformAccessory[]): void;
    }


}