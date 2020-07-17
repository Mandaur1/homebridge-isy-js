import './ISYPlatform';
import { Categories } from 'hap-nodejs';
import { Fan, Lightbulb } from 'hap-nodejs/dist/lib/gen/HomeKit';
import * as HB from 'homebridge';
import { InsteonFanDevice } from 'isy-nodejs';
import { ISYDeviceAccessory } from './ISYDeviceAccessory';
import { ISYPlatform } from './ISYPlatform';
export declare class ISYFanAccessory extends ISYDeviceAccessory<InsteonFanDevice, Categories.FAN> {
    fanService: Fan;
    lightService?: Lightbulb;
    constructor(device: InsteonFanDevice, platform: ISYPlatform);
    map(propertyName: string, propertyValue: any): {
        characteristicValue: any;
        characteristic: typeof import("hap-nodejs/dist/lib/gen/HomeKit").RotationSpeed;
        service: Fan;
    };
    convertTo(propertyName: any, value: any): any;
    convertFrom(characteristic: HB.Characteristic, value: HB.CharacteristicValue): any;
    handlePropertyChange(propertyName: string, value: any, oldValue: any, formattedValue: any): void;
    setupServices(): void;
}
//# sourceMappingURL=ISYFanAccessory.d.ts.map