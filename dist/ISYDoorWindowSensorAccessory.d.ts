import './utils';
import { Categories, Characteristic, Service } from 'hap-nodejs';
import { InsteonDoorWindowSensorDevice } from 'isy-nodejs';
import { ISYDeviceAccessory } from './ISYDeviceAccessory';
export declare class ISYDoorWindowSensorAccessory extends ISYDeviceAccessory<InsteonDoorWindowSensorDevice, Categories.SENSOR> {
    constructor(device: InsteonDoorWindowSensorDevice);
    map(propertyName: any, propertyValue: any): {
        characteristicValue: import("hap-nodejs").CharacteristicValue;
        characteristic?: import("hap-nodejs").WithUUID<new () => Characteristic>;
        service: Service;
    };
    setupServices(): void;
}
//# sourceMappingURL=ISYDoorWindowSensorAccessory.d.ts.map