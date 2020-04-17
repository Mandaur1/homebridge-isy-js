import './ISYPlatform';

import { Categories, Characteristic, CharacteristicEventTypes, Service } from 'hap-nodejs';
import { InsteonFanDevice } from 'isy-nodejs';

import { ISYDeviceAccessory } from './ISYDeviceAccessory';

export class ISYFanAccessory extends ISYDeviceAccessory<InsteonFanDevice,Categories.FAN> {
	public fanService: Service;
	public lightService: Service;
	constructor (device: InsteonFanDevice) {
		super(device);
		this.category = Categories.FAN;
		device.propertyChanged.removeListener(null, super.handleExternalChange);
		this.device.Motor.onPropertyChanged(null, this.handleExternalChangeToMotor.bind(this));
		this.device.Light.onPropertyChanged(null, this.handleExternalChangeToLight.bind(this));
		// this.logger(JSON.stringify(this.device.scenes[0]));
	}
	// Translates the fan level from homebridge into the isy-nodejs level. Maps from the 0-100
	// to the four isy-nodejs fan speed levels.

	// Handles a request to get the current brightness level for dimmable lights.
	public getBrightness(callback: (...any: any[]) => void) {
		callback(null, this.device.brightnessLevel);
	}
	// Mirrors change in the state of the underlying isj-js device object.
	public handleExternalChangeToMotor(propertyName: string, value: any, formattedValue: string) {
		//super.handleExternalChange(propertyName, value, formattedValue);

		this.fanService.getCharacteristic(Characteristic.On).updateValue(this.device.isOn);
		this.fanService.getCharacteristic(Characteristic.RotationSpeed).updateValue(this.device.fanSpeed);

	}
	public handleExternalChangeToLight(propertyName: string, value: any, formattedValue: string) {
		//super.handleExternalChange(propertyName, value, formattedValue);
		this.lightService
			.getCharacteristic(Characteristic.On).updateValue(this.device.Light.isOn);
		if (this.dimmable) {
			this.lightService
				.getCharacteristic(Characteristic.Brightness).updateValue(this.device.Light.level);
		}
	}
	// Returns the services supported by the fan device.
	public setupServices() {
		super.setupServices();
		const fanService = this.platformAccessory.getOrAddService(Service.Fan);
		this.fanService = fanService;
		const lightService = this.platformAccessory.getOrAddService(Service.Lightbulb);
		this.lightService = lightService;
		fanService.getCharacteristic(Characteristic.RotationSpeed).onSet(this.device.Motor.updateFanSpeed.bind(this.device.Motor)).onGet(() => this.device.Motor.fanSpeed);
		fanService.getCharacteristic(Characteristic.On).onSet(this.device.Motor.updateIsOn.bind(this.device.Motor)).onGet(() => this.device.Motor.isOn);
		lightService.getCharacteristic(Characteristic.On).onSet(this.device.Light.updateIsOn.bind(this.device.Light)).onGet(() => this.device.Light.isOn);
		lightService.getCharacteristic(Characteristic.Brightness).onSet(this.device.Light.updateBrightnessLevel.bind(this.device.Light)).onGet(() => this.device.Light.brightnessLevel);
		fanService.isPrimaryService = true;
		this.primaryService = fanService;

	}
}
