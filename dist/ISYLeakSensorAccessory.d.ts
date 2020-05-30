import './utils';
import { Categories } from 'hap-nodejs';
import { InsteonLeakSensorDevice } from 'isy-nodejs';
import { ISYDeviceAccessory } from './ISYDeviceAccessory';
export declare class ISYLeakSensorAccessory extends ISYDeviceAccessory<InsteonLeakSensorDevice, Categories.SENSOR> {
    map(propertyName: any, propertyValue: any): {
        characteristicValue: number;
        characteristic: typeof import("hap-nodejs/dist/lib/gen/HomeKit").LeakDetected;
        service: import("hap-nodejs").Service;
    } | {
        characteristicValue: any;
        service: import("hap-nodejs").Service;
        characteristic?: undefined;
    };
    handlePropertyChange(propertyName: string, value: any, oldValue: any, formattedValue: string): void;
    setupServices(): void;
}
//# sourceMappingURL=ISYLeakSensorAccessory.d.ts.map