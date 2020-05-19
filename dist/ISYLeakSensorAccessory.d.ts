import './utils';
import { Categories } from 'hap-nodejs';
import { InsteonLeakSensorDevice } from 'isy-nodejs';
import { ISYDeviceAccessory } from './ISYDeviceAccessory';
export declare class ISYLeakSensorAccessory extends ISYDeviceAccessory<InsteonLeakSensorDevice, Categories.SENSOR> {
    map(propertyName: any, propertyValue: any): {
        characteristicValue: import("hap-nodejs").CharacteristicValue;
        characteristic?: import("hap-nodejs").WithUUID<new () => import("hap-nodejs").Characteristic>;
        service: import("hap-nodejs").Service;
    };
    handlePropertyChange(propertyName: string, value: any, oldValue: any, formattedValue: string): void;
    setupServices(): void;
}
//# sourceMappingURL=ISYLeakSensorAccessory.d.ts.map