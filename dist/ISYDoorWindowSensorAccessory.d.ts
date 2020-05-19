import './utils';
import { Categories } from 'hap-nodejs';
import { InsteonDoorWindowSensorDevice } from 'isy-nodejs';
import { ISYDeviceAccessory } from './ISYDeviceAccessory';
export declare class ISYDoorWindowSensorAccessory extends ISYDeviceAccessory<InsteonDoorWindowSensorDevice, Categories.SENSOR> {
    map(propertyName: any, propertyValue: any): {
        characteristicValue: import("hap-nodejs").CharacteristicValue;
        characteristic?: import("hap-nodejs").WithUUID<new () => import("hap-nodejs").Characteristic>;
        service: import("hap-nodejs").Service;
    };
    setupServices(): void;
}
//# sourceMappingURL=ISYDoorWindowSensorAccessory.d.ts.map