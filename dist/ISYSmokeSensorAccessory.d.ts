import { Categories } from 'hap-nodejs';
import { InsteonSmokeSensorDevice } from 'isy-nodejs';
import { ISYDeviceAccessory } from './ISYDeviceAccessory';
export declare class ISYSmokeSensorAccessory extends ISYDeviceAccessory<InsteonSmokeSensorDevice, Categories.SENSOR> {
    constructor(device: InsteonSmokeSensorDevice, platform: any);
    map(propertyName: any, propertyValue: any): {
        characteristicValue: import("hap-nodejs").CharacteristicValue;
        characteristic?: import("hap-nodejs").WithUUID<new () => import("hap-nodejs").Characteristic>;
        service: import("hap-nodejs").Service;
    };
    setupServices(): void;
}
//# sourceMappingURL=ISYSmokeSensorAccessory.d.ts.map