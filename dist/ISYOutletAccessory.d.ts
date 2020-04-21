import './utils';
import { Categories, Service } from 'hap-nodejs';
import { InsteonOutletDevice, InsteonOnOffOutletDevice } from 'isy-nodejs';
import { ISYDeviceAccessory } from './ISYDeviceAccessory';
export declare class ISYOnOffOutletAccessory extends ISYDeviceAccessory<InsteonOnOffOutletDevice, Categories.OUTLET> {
    get outlet1Service(): Service;
    _outlet2Service: Service;
    get outlet2Service(): Service;
    constructor(device: InsteonOnOffOutletDevice);
    setupServices(): void;
}
export declare class ISYOutletAccessory extends ISYDeviceAccessory<InsteonOutletDevice, Categories.OUTLET> {
    constructor(device: InsteonOutletDevice);
    setOutletState(outletState: boolean, callback: (...any: any[]) => any): void;
    getOutletState(callback: (...any: any[]) => void): void;
    getOutletInUseState(callback: (...any: any[]) => void): void;
    handleExternalChange(propertyName: string, value: any, oldValue: any, formattedValue: string): void;
    setupServices(): void;
}
//# sourceMappingURL=ISYOutletAccessory.d.ts.map