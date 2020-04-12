import './utils';
import { Categories, Service } from 'hap-nodejs';
import { InsteonDoorWindowSensorDevice } from 'isy-js';
import { ISYDeviceAccessory } from './ISYDeviceAccessory';
export declare class ISYDoorWindowSensorAccessory extends ISYDeviceAccessory<InsteonDoorWindowSensorDevice, Categories.SENSOR> {
    sensorService: Service;
    constructor(device: InsteonDoorWindowSensorDevice);
    translateCurrentDoorWindowState(): boolean;
    getCurrentDoorWindowState(callback: any): void;
    handleExternalChange(propertyName: string, value: any, formattedValue: string): void;
    setupServices(): Service[];
}
