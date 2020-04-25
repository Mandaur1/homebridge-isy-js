import { Categories, Characteristic, Service } from 'hap-nodejs';
import { InsteonSmokeSensorDevice } from 'isy-nodejs';
import { ISYDeviceAccessory } from './ISYDeviceAccessory';
export declare class ISYSmokeSensorAccessory extends ISYDeviceAccessory<InsteonSmokeSensorDevice, Categories.SENSOR> {
    constructor(device: InsteonSmokeSensorDevice);
    map(propertyName: any, propertyValue: any): {
        characteristicValue: import("hap-nodejs").CharacteristicValue;
        characteristic?: import("hap-nodejs").WithUUID<new () => Characteristic>;
        service: Service;
    };
    setupServices(): void;
}
//# sourceMappingURL=ISYSmokeSensorAccessory.d.ts.map