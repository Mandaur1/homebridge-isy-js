import './utils';
import { Categories } from 'hap-nodejs';
import { InsteonOutletDevice } from 'isy-nodejs';
import { ISYDeviceAccessory } from './ISYDeviceAccessory';
export declare class ISYOutletAccessory extends ISYDeviceAccessory<InsteonOutletDevice, Categories.OUTLET> {
    constructor(device: InsteonOutletDevice);
    setOutletState(outletState: boolean, callback: (...any: any[]) => any): void;
    getOutletState(callback: (...any: any[]) => void): void;
    getOutletInUseState(callback: (...any: any[]) => void): void;
    handleExternalChange(propertyName: string, value: any, formattedValue: string): void;
    setupServices(): void;
}
//# sourceMappingURL=ISYOutletAccessory.d.ts.map