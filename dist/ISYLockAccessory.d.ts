import { Categories, Service } from 'hap-nodejs';
import { InsteonLockDevice } from 'isy-js';
import { ISYDeviceAccessory } from './ISYDeviceAccessory';
export declare class ISYLockAccessory extends ISYDeviceAccessory<InsteonLockDevice, Categories.DOOR_LOCK> {
    lockService: any;
    constructor(device: InsteonLockDevice);
    setTargetLockState(lockState: number, callback: (...any: any[]) => void): void;
    getDeviceCurrentStateAsHK(): 1 | 0;
    getLockCurrentState(callback: any): void;
    getTargetLockState(callback: any): void;
    handleExternalChange(propertyName: any, value: any, formattedValue: any): void;
    setupServices(): Service[];
}
