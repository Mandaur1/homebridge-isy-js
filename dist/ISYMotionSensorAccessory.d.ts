import { Categories } from 'hap-nodejs';
import { BatteryService, LightSensor, MotionSensor, TemperatureSensor } from 'hap-nodejs/dist/lib/gen/HomeKit';
import { InsteonMotionSensorDevice } from 'isy-nodejs';
import { ISYDeviceAccessory } from './ISYDeviceAccessory';
export declare class ISYMotionSensorAccessory extends ISYDeviceAccessory<InsteonMotionSensorDevice, Categories.SENSOR> {
    get motionSensorService(): MotionSensor;
    get lightSensorService(): LightSensor;
    get batteryLevelService(): BatteryService;
    get temperatureSensorService(): TemperatureSensor;
    constructor(device: InsteonMotionSensorDevice);
    map(propertyName: string, propertyValue: any): {
        characteristicValue: any;
        characteristic: typeof import("hap-nodejs/dist/lib/gen/HomeKit").CurrentTemperature;
        service: TemperatureSensor;
    };
    setupServices(): void;
}
//# sourceMappingURL=ISYMotionSensorAccessory.d.ts.map