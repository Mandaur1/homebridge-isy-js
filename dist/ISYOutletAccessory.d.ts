import './utils';
import { Categories, Service } from 'hap-nodejs';
import { InsteonOutletDevice } from 'isy-js';
import { ISYDeviceAccessory } from './ISYDeviceAccessory';
export declare class ISYOutletAccessory extends ISYDeviceAccessory<InsteonOutletDevice, Categories.OUTLET> {
    outletService: any;
    constructor(device: InsteonOutletDevice);
    setOutletState(outletState: boolean, callback: (...any: any[]) => any): void;
    getOutletState(callback: (...any: any[]) => void): void;
    getOutletInUseState(callback: (...any: any[]) => void): void;
    handleExternalChange(propertyName: string, value: any, formattedValue: string): void;
    setupServices(): Service[];
}
