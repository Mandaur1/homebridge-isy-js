import './ISYPlatform';

import { Categories, Characteristic, CharacteristicEventTypes, Service } from 'hap-nodejs';
import { InsteonFanDevice } from 'isy-js';

import { ISYDeviceAccessory } from './ISYDeviceAccessory';

export class ISYFanAccessory extends ISYDeviceAccessory<InsteonFanDevice,Categories.FAN> {
	public fanService: Service;
	public lightService: Service;
	constructor (device: InsteonFanDevice) {
		super(device);
		//this.device.Motor.onPropertyChanged(null, this.handleExternalChangeToMotor.bind(this));
		this.device.Light.onPropertyChanged(null, this.handleExternalChangeToLight.bind(this));
		// this.logger(JSON.stringify(this.device.scenes[0]));
	}
	// Translates the fan level from homebridge into the isy-js level. Maps from the 0-100
	// to the four isy-js fan speed levels.
	public translateHKToFanSpeed(fanStateHK: number) {
		if (fanStateHK === 0) {
			return 0;
		} else if (fanStateHK > 0 && fanStateHK <= 25) {
			return 25;
		} else if (fanStateHK >= 33 && fanStateHK <= 75) {
			return 75;
		} else if (fanStateHK > 75) {
			return 100;
		} else {
			this.logger(`ERROR: Unknown fan state!`);
			return 0;

		}
	}
	// Returns the current state of the fan from the isy-js level to the 0-100 level of HK.
	public getFanRotationSpeed(callback: (...any: any[]) => void) {
		this.logger(`Getting fan rotation speed. Device says: ${this.device.fanSpeed} translation says: ${this.device.fanSpeed}`);
		callback(null, this.device.fanSpeed);
	}
	// Sets the current state of the fan from the 0-100 level of HK to the isy-js level.
	public setFanRotationSpeed(fanStateHK, callback: (...any: any[]) => void) {
		this.logger(`Sending command to set fan state (pre-translate) to: ${fanStateHK}`);
		const newFanState = this.translateHKToFanSpeed(fanStateHK);
		this.logger(`Sending command to set fan state to: ${fanStateHK}`);
		if (newFanState !== this.device.fanSpeed) {
			this.device
				.updateFanSpeed(newFanState).handleWith(callback);
		} else {
			this.logger(`Fan command does not change actual speed`);
			callback();
		}
	}
	public getLightOnState() { }
	// Returns true if the fan is on
	public getIsFanOn() {
		this.logger(`Getting fan is on. Device says: ${this.device.isOn} Code says: ${this.device.isOn}`);
		return this.device.isOn;
	}
	// Returns the state of the fan to the homebridge system for the On characteristic
	public getFanOnState(callback) {
		callback(null, this.device.isOn);
	}
	// Sets the fan state based on the value of the On characteristic. Default to Medium for on.
	public setFanOnState(onState, callback) {
		this.logger(`Setting fan on state to: ${onState} Device says: ${this.device.isOn}`);
		if (onState !== this.device.isOn) {
			if (onState) {
				this.logger('Turning fan on. Setting fan speed to high.');
				this.device
					.updateIsOn(onState).handleWith(callback);
			} else {
				this.logger(`Turning fan off.`);
				this.device
					.updateIsOn(onState).handleWith(callback);
			}
		} else {
			this.logger(`Fan command does not change actual state`);
			callback();
		}
	}
	public setPowerState(powerOn: boolean, callback: (...any: any[]) => void) {
		this.logger(`Setting powerstate to ${powerOn}`);
		if (powerOn !== this.device.isOn) {
			this.logger(`Changing powerstate to ${powerOn}`);
			this.device
				.updateIsOn(powerOn).handleWith(callback);
		} else {
			this.logger(`Ignoring redundant setPowerState`);
			callback();
		}
	}
	// Handles request to get the current on state
	public getPowerState(callback: (...any: any[]) => void) {
		callback(null, this.device.isOn);
	}
	// Handles request to set the brightness level of dimmable lights. Ignore redundant commands.
	public setBrightness(level, callback: (...any: any[]) => void) {
		this.logger(`Setting brightness to ${level}`);
		if (level !== this.device.brightnessLevel) {
			this.device.updateBrightnessLevel(level);
		} else {
			this.logger(`Ignoring redundant setBrightness`);
			callback();
		}
	}
	// Handles a request to get the current brightness level for dimmable lights.
	public getBrightness(callback: (...any: any[]) => void) {
		callback(null, this.device.brightnessLevel);
	}
	// Mirrors change in the state of the underlying isj-js device object.
	public handleExternalChangeToMotor(propertyName: string, value: any, formattedValue: string) {
		super.handleExternalChange(propertyName, value, formattedValue);
		this.fanService.getCharacteristic(Characteristic.On).updateValue(this.device.isOn);
		this.fanService.getCharacteristic(Characteristic.RotationSpeed).updateValue(this.device.fanSpeed);


	}
	public handleExternalChangeToLight(propertyName: string, value: any, formattedValue: string) {
		super.handleExternalChange(propertyName, value, formattedValue);


		this.lightService
			.getCharacteristic(Characteristic.On).updateValue(this.device.Light.isOn);
		if (this.dimmable) {
			this.lightService
				.getCharacteristic(Characteristic.Brightness).updateValue(this.device.Light.level);
		}
	}
	// Returns the services supported by the fan device.
	public setupServices() {
		const s = super.setupServices();
		const fanService = this.platformAccessory.getOrAddService(Service.Fan);
		this.fanService = fanService;
		const lightService = this.platformAccessory.getOrAddService(Service.Lightbulb);
		this.lightService = lightService;
		fanService.getCharacteristic(Characteristic.RotationSpeed).onSet(this.device.Motor.updateFanSpeed.bind(this.device.Motor)).onGet(() => this.device.Motor.fanSpeed);
		fanService.getCharacteristic(Characteristic.On).onSet(this.device.Motor.updateIsOn.bind(this.device.Motor)).onGet(() => this.device.Motor.isOn);
		lightService.getCharacteristic(Characteristic.On).onSet(this.device.Light.updateIsOn.bind(this.device.Light)).onGet(() => this.device.Light.isOn);
		lightService.getCharacteristic(Characteristic.Brightness).onSet(this.device.Light.updateBrightnessLevel.bind(this.device.Light)).onGet(() => this.device.Light.brightnessLevel);
		fanService.isPrimaryService = true;
		s.push(fanService, lightService);

		return s;
	}
}
