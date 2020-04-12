import './utils';
import { Categories, Service } from 'hap-nodejs';
import { InsteonThermostatDevice } from 'isy-js';
import { ISYDeviceAccessory } from './ISYDeviceAccessory';
export declare class ISYThermostatAccessory extends ISYDeviceAccessory<InsteonThermostatDevice, Categories.THERMOSTAT> {
    targetTemperature: number;
    thermostatService: Service;
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
    handleExternalChange(propertyName: string, value: any, formattedValue: string): void;
    setupServices(): Service[];
    setCoolSetPoint(temp: number, callback: (...any: any[]) => void): void;
    setHeatSetPoint(temp: number, callback: (...any: any[]) => void): void;
    setHeatingCoolingMode(mode: any, callback: (...any: any[]) => void): void;
}
