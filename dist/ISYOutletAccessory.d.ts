import './utils';
import { InsteonOnOffOutletDevice, InsteonOutletDevice } from 'isy-nodejs';
import { Categories, Service as HAPService } from 'homebridge';
import { ISYDeviceAccessory } from './ISYDeviceAccessory';
export declare class ISYOnOffOutletAccessory extends ISYDeviceAccessory<InsteonOnOffOutletDevice, Categories.OUTLET> {
    get outlet1Service(): HAPService;
    _outlet2Service: HAPService;
    get outlet2Service(): HAPService;
    map(propertyName: any, propertyValue: any): {
        characteristicValue: any;
        characteristic: typeof import("hap-nodejs/dist/lib/gen/HomeKit").On;
        service: HAPService;
    };
    setupServices(): void;
}
export declare class ISYOutletAccessory extends ISYDeviceAccessory<InsteonOutletDevice, Categories.OUTLET> {
    handlePropertyChange(propertyName: string, value: any, oldValue: any, formattedValue: string): void;
    setupServices(): void;
}
//# sourceMappingURL=ISYOutletAccessory.d.ts.map