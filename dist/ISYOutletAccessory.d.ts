import './utils';
import { Categories, Service } from 'hap-nodejs';
import { InsteonOutletDevice, InsteonOnOffOutletDevice } from 'isy-nodejs';
import { ISYDeviceAccessory } from './ISYDeviceAccessory';
export declare class ISYOnOffOutletAccessory extends ISYDeviceAccessory<InsteonOnOffOutletDevice, Categories.OUTLET> {
    get outlet1Service(): Service;
    _outlet2Service: Service;
    get outlet2Service(): Service;
    constructor(device: InsteonOnOffOutletDevice);
    map(propertyName: any, propertyValue: any): {
        characteristicValue: any;
        characteristic: typeof import("hap-nodejs/dist/lib/gen/HomeKit").On;
        service: Service;
    };
    setupServices(): void;
}
export declare class ISYOutletAccessory extends ISYDeviceAccessory<InsteonOutletDevice, Categories.OUTLET> {
    constructor(device: InsteonOutletDevice);
    handlePropertyChange(propertyName: string, value: any, oldValue: any, formattedValue: string): void;
    setupServices(): void;
}
//# sourceMappingURL=ISYOutletAccessory.d.ts.map