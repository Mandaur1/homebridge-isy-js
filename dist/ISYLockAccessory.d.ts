import { Categories } from 'hap-nodejs';
import { InsteonLockDevice } from 'isy-nodejs';
import { ISYDeviceAccessory } from './ISYDeviceAccessory';
export declare class ISYLockAccessory extends ISYDeviceAccessory<InsteonLockDevice, Categories.DOOR_LOCK> {
    lockService: any;
    setTargetLockState(lockState: number, callback: (...any: any[]) => void): void;
    getDeviceCurrentStateAsHK(): 0 | 1;
    getLockCurrentState(callback: any): void;
    getTargetLockState(callback: any): void;
    handlePropertyChange(propertyName: any, value: any, oldValue: any, formattedValue: any): void;
    setupServices(): void;
}
//# sourceMappingURL=ISYLockAccessory.d.ts.map