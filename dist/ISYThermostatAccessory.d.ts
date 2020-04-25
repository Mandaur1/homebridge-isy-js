import './utils';
import { Categories } from 'hap-nodejs';
import { InsteonThermostatDevice } from 'isy-nodejs';
import { ISYDeviceAccessory } from './ISYDeviceAccessory';
export declare class ISYThermostatAccessory extends ISYDeviceAccessory<InsteonThermostatDevice, Categories.THERMOSTAT> {
    targetTemperature: number;
    constructor(device: InsteonThermostatDevice);
    toCelsius(temp: number): any;
    toFahrenheit(temp: number): any;
    getCurrentTemperature(callback: (...any: any[]) => void): void;
    getCoolSetPoint(callback: (...any: any[]) => void): void;
    getHeatSetPoint(callback: (...any: any[]) => void): void;
    getMode(callback: (...any: any[]) => void): void;
    getOperatingMode(callback: (...any: any[]) => void): void;
    getFanMode(callback: (...any: any[]) => void): void;
    getHumidity(callback: (...any: any[]) => void): void;
    handlePropertyChange(propertyName: string, value: any, oldValue: any, formattedValue: string): void;
    setupServices(): void;
    setCoolSetPoint(temp: number, callback: (...any: any[]) => void): void;
    setHeatSetPoint(temp: number, callback: (...any: any[]) => void): void;
    setHeatingCoolingMode(mode: any, callback: (...any: any[]) => void): void;
}
//# sourceMappingURL=ISYThermostatAccessory.d.ts.map