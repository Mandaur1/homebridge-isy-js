import { Categories, Characteristic, Service } from 'hap-nodejs';
import { BatteryService, LightSensor, MotionSensor, TemperatureSensor } from 'hap-nodejs/dist/lib/gen/HomeKit';
import { InsteonMotionSensorDevice } from 'isy-js';
import { ISYDeviceAccessory } from './ISYDeviceAccessory';
export declare class ISYMotionSensorAccessory extends ISYDeviceAccessory<InsteonMotionSensorDevice, Categories.SENSOR> {
    get motionSensorService(): MotionSensor;
    get lightSensorService(): LightSensor;
    get batteryLevelService(): BatteryService;
    get temperatureSensorService(): TemperatureSensor;
    constructor(device: InsteonMotionSensorDevice);
    map(propertyName: string): {
        characteristic: typeof Characteristic;
        service: Service;
    };
    getCurrentMotionSensorState(callback: (...any: any[]) => void): void;
    setupServices(): void;
}
//# sourceMappingURL=ISYMotionSensorAccessory.d.ts.map