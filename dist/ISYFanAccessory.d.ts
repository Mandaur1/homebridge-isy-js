import './ISYPlatform';
import { Categories, Service } from 'hap-nodejs';
import { InsteonFanDevice } from 'isy-nodejs';
import { ISYDeviceAccessory } from './ISYDeviceAccessory';
export declare class ISYFanAccessory extends ISYDeviceAccessory<InsteonFanDevice, Categories.FAN> {
    fanService: Service;
    lightService: Service;
    constructor(device: InsteonFanDevice);
    map(propertyName: any, propertyValue: any): {
        characteristicValue: any;
        characteristic: typeof import("hap-nodejs/dist/lib/gen/HomeKit").RotationSpeed;
        service: Service;
    };
    handlePropertyChange(propertyName: string, value: any, oldValue: any, formattedValue: any): void;
    setupServices(): void;
}
//# sourceMappingURL=ISYFanAccessory.d.ts.map