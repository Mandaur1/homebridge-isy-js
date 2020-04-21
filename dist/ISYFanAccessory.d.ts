import './ISYPlatform';
import { Categories, Characteristic, Service } from 'hap-nodejs';
import { InsteonFanDevice } from 'isy-nodejs';
import { ISYDeviceAccessory } from './ISYDeviceAccessory';
export declare class ISYFanAccessory extends ISYDeviceAccessory<InsteonFanDevice, Categories.FAN> {
    fanService: Service;
    lightService: Service;
    constructor(device: InsteonFanDevice);
    map(propertyName: any): {
        characteristic: typeof Characteristic;
        service: Service;
    };
    handleExternalChange(propertyName: any, value: any, formattedValue: any): void;
    setupServices(): void;
}
//# sourceMappingURL=ISYFanAccessory.d.ts.map