import './utils';
import { Categories } from 'hap-nodejs';
import { InsteonLeakSensorDevice } from 'isy-nodejs';
import { ISYDeviceAccessory } from './ISYDeviceAccessory';
export declare class ISYLeakSensorAccessory extends ISYDeviceAccessory<InsteonLeakSensorDevice, Categories.SENSOR> {
    constructor(device: InsteonLeakSensorDevice);
    handleExternalChange(propertyName: string, value: any, oldValue: any, formattedValue: string): void;
    setupServices(): void;
}
//# sourceMappingURL=ISYLeakSensorAccessory.d.ts.map