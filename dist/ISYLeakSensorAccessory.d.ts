import './utils';
import { Categories, Characteristic, Service } from 'hap-nodejs';
import { InsteonLeakSensorDevice } from 'isy-nodejs';
import { ISYDeviceAccessory } from './ISYDeviceAccessory';
export declare class ISYLeakSensorAccessory extends ISYDeviceAccessory<InsteonLeakSensorDevice, Categories.SENSOR> {
    constructor(device: InsteonLeakSensorDevice);
    map(propertyName: any, propertyValue: any): {
        characteristicValue: import("hap-nodejs").CharacteristicValue;
        characteristic?: import("hap-nodejs").WithUUID<new () => Characteristic>;
        service: Service;
    };
    handlePropertyChange(propertyName: string, value: any, oldValue: any, formattedValue: string): void;
    setupServices(): void;
}
//# sourceMappingURL=ISYLeakSensorAccessory.d.ts.map