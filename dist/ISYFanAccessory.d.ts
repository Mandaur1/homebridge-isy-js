import './ISYPlatform';
import { Categories } from 'hap-nodejs';
import { InsteonFanDevice } from 'isy-nodejs';
import { Fan, Lightbulb } from 'hap-nodejs/dist/lib/gen/HomeKit';
import { ISYDeviceAccessory } from './ISYDeviceAccessory';
import { ISYPlatform } from './ISYPlatform';
export declare class ISYFanAccessory extends ISYDeviceAccessory<InsteonFanDevice, Categories.FAN> {
    fanService: Fan;
    lightService: Lightbulb;
    constructor(device: InsteonFanDevice, platform: ISYPlatform);
    map(propertyName: any, propertyValue: any): {
        characteristicValue: any;
        characteristic: typeof import("hap-nodejs/dist/lib/gen/HomeKit").RotationSpeed;
        service: Fan;
    };
    handlePropertyChange(propertyName: string, value: any, oldValue: any, formattedValue: any): void;
    setupServices(): void;
}
//# sourceMappingURL=ISYFanAccessory.d.ts.map