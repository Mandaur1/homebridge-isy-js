import './ISYPlatform';
import { Categories, Service } from 'hap-nodejs';
import { InsteonFanDevice } from 'isy-js';
import { ISYDeviceAccessory } from './ISYDeviceAccessory';
export declare class ISYFanAccessory extends ISYDeviceAccessory<InsteonFanDevice, Categories.FAN> {
    fanService: Service;
    lightService: Service;
    constructor(device: InsteonFanDevice);
    getBrightness(callback: (...any: any[]) => void): void;
    handleExternalChangeToMotor(propertyName: string, value: any, formattedValue: string): void;
    handleExternalChangeToLight(propertyName: string, value: any, formattedValue: string): void;
    setupServices(): Service[];
}
