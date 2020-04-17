import './utils';

import { Categories, Characteristic, CharacteristicEventTypes, Service } from 'hap-nodejs';
import { InsteonThermostatDevice, Props } from 'isy-nodejs';

import { ISYDeviceAccessory } from './ISYDeviceAccessory';


//import { Service } from 'homebridge/node_modules/hap-nodejs/dist/lib/Service';
//import { Characteristic } from 'homebridge/node_modules/hap-nodejs/dist/lib/Characteristic';
export class ISYThermostatAccessory extends ISYDeviceAccessory<InsteonThermostatDevice,Categories.THERMOSTAT> {
	public targetTemperature: number;

	constructor(device: InsteonThermostatDevice) {
		super(device);
	}
	public toCelsius(temp: number): any {
		return ((temp - 32.0) * 5.0) / 9.0;
	}
	public toFahrenheit(temp: number): any {
		return Math.round((temp * 9.0) / 5.0 + 32.0);
	}
	public getCurrentTemperature(callback: (...any: any[]) => void) {
		this.logger.info(`Getting Current Temperature - Device says: ${this.device.currentTemperature} says: ${this.toCelsius(this.device.currentTemperature)}`);
		callback(null, this.toCelsius(this.device.currentTemperature));
	}

	public getCoolSetPoint(callback: (...any: any[]) => void)  {
		this.logger.info(`Getting Cooling Set Point - Device says: ${this.device.coolSetPoint} translation says: ${this.toCelsius(this.device.coolSetPoint)}`);
		callback(null, this.toCelsius(this.device.coolSetPoint));
	}
	public getHeatSetPoint(callback: (...any: any[]) => void)  {
		this.logger.info(`Getting Heating Set Point - Device says: ${this.device.heatSetPoint} translation says: ${this.toCelsius(this.device.heatSetPoint)}`);
		callback(null, this.toCelsius(this.device.heatSetPoint));
	}
	public getMode(callback: (...any: any[]) => void) {
		this.logger.info(`Getting Heating Cooling Mode - Device says: ${this.device.mode}`);
		callback(null, this.device.mode);
	}
	public getOperatingMode(callback: (...any: any[]) => void)  {
		this.logger.info(`Getting Heating Cooling State - Device says: ${this.device.operatingMode}`);
		callback(null, this.device.operatingMode);
	}
	public getFanMode(callback: (...any: any[]) => void) {
		this.logger.info(`Getting Fan State - Device says: ${this.device.fanMode}`);
		callback(null, this.device.fanMode);
	}
	public getHumidity(callback: (...any: any[]) => void) {
		this.logger.info(`Getting Current Rel. Humidity - Device says: ${this.device.humidity}`);
		callback(null, this.device.humidity);
	}
	// Mirrors change in the state of the underlying isy-nodejs device object.
	public handleExternalChange(propertyName: string, value: any, formattedValue: string) {
		super.handleExternalChange(propertyName, value, formattedValue);
		switch (propertyName) {
			case Props.Climate.Temperature:
				this.primaryService.getCharacteristic(Characteristic.CurrentTemperature).updateValue(this.toCelsius(this.device.currentTemperature));
				break;
			case Props.Climate.CoolSetPoint:
				this.primaryService.getCharacteristic(Characteristic.CoolingThresholdTemperature).updateValue(this.toCelsius(this.device.coolSetPoint));
				break;
			case Props.Climate.HeatSetPoint:
				this.primaryService.getCharacteristic(Characteristic.CoolingThresholdTemperature).updateValue(this.toCelsius(this.device.heatSetPoint));
				break;
			case Props.Climate.OperatingMode:
				this.primaryService.getCharacteristic(Characteristic.CurrentHeatingCoolingState).updateValue(this.device.operatingMode);
				break;
			case Props.Climate.Mode:
				this.primaryService.getCharacteristic(Characteristic.TargetHeatingCoolingState).updateValue(this.device.mode);
				break;
			case Props.Climate.FanMode:
				this.primaryService.getCharacteristic(Characteristic.CurrentFanState).updateValue(this.device.fanMode);
				break;
			case Props.Climate.Humidity:
				this.primaryService.getCharacteristic(Characteristic.CurrentRelativeHumidity).updateValue(this.device.humidity);
				break;
			default:
				break;
		}
	}
	public setupServices(){
		super.setupServices();
		this.primaryService = this.addService(Service.Thermostat);
		// primaryService.getCharacteristic(Characteristic.TargetTemperature).on("get", this.getTargetTemperature.bind(this));
		// primaryService.getCharacteristic(Characteristic.TargetTemperature).on("set", this.setTargetTemperature.bind(this));
		this.primaryService.setCharacteristic(Characteristic.TemperatureDisplayUnits, 1);
		this.primaryService.addCharacteristic(Characteristic.CurrentFanState);
		this.primaryService.getCharacteristic(Characteristic.CurrentFanState).on(CharacteristicEventTypes.GET, (f) => this.getFanMode(f));
		this.primaryService.getCharacteristic(Characteristic.CurrentTemperature).on(CharacteristicEventTypes.GET, this.getCurrentTemperature.bind(this));
		this.primaryService.getCharacteristic(Characteristic.CoolingThresholdTemperature).on(CharacteristicEventTypes.GET, this.getCoolSetPoint.bind(this));
		this.primaryService.getCharacteristic(Characteristic.CoolingThresholdTemperature).on(CharacteristicEventTypes.SET, this.setCoolSetPoint.bind(this));
		this.primaryService.getCharacteristic(Characteristic.HeatingThresholdTemperature).on(CharacteristicEventTypes.GET, this.getHeatSetPoint.bind(this));
		this.primaryService.getCharacteristic(Characteristic.HeatingThresholdTemperature).on(CharacteristicEventTypes.SET, this.setHeatSetPoint.bind(this));
		this.primaryService.getCharacteristic(Characteristic.CurrentHeatingCoolingState).on(CharacteristicEventTypes.GET, this.getOperatingMode.bind(this));
		this.primaryService.getCharacteristic(Characteristic.TargetHeatingCoolingState).on(CharacteristicEventTypes.GET, this.getMode.bind(this));
		this.primaryService.getCharacteristic(Characteristic.TargetHeatingCoolingState).on(CharacteristicEventTypes.SET, this.setHeatingCoolingMode.bind(this));
		this.primaryService.getCharacteristic(Characteristic.CurrentRelativeHumidity).on(CharacteristicEventTypes.GET, this.getHumidity.bind(this));


		// primaryService
		//   .getCharacteristic(Characteristic.RotationSpeed)
		//   .on(CharacteristicEventTypes.SET, this.setThermostatRotationSpeed.bind(this));

	}
	public setCoolSetPoint(temp: number, callback: (...any: any[]) => void) {
		this.logger.info(`Sending command to set cool set point (pre-translate) to: ${temp}`);
		const newSetPoint = this.toFahrenheit(temp);
		this.logger.info(`Sending command to set cool set point to: ${newSetPoint}`);
		if (Math.abs(newSetPoint - this.device.coolSetPoint) >= 1) {
			this.device.updateCoolSetPoint(newSetPoint).handleWith(callback);
		} else {
			this.logger.info(`Command does not change actual set point`);
			callback();
		}
	}
	public setHeatSetPoint(temp: number, callback: (...any: any[]) => void) {
		this.logger.info(`Sending command to set heat set point (pre-translate) to: ${temp}`);
		const newSetPoint = this.toFahrenheit(temp);
		this.logger.info(`Sending command to set heat set point to: ${newSetPoint}`);
		if (Math.abs(newSetPoint - this.device.heatSetPoint) >= 1) {
			this.device
				.updateHeatSetPoint(newSetPoint).handleWith(callback);
		} else {
			this.logger.info(`Command does not change actual set point`);
			callback();
		}
	}
	public setHeatingCoolingMode(mode: any, callback: (...any: any[]) => void) {
		this.logger.info(`Sending command to set heating/cooling mode (pre-translate) to: ${mode}`);
		// this.logger.info("THERM: " + this.device.name + " Sending command to set cool set point to: " + newSetPoint);
		if (mode !== this.device.mode) {
			this.device
				.updateMode(mode).handleWith(callback);
		} else {
			this.logger.info(`Command does not change actual mode`);
			callback();
		}
	}
}
