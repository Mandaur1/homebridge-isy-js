import './ISYPlatform';

import { Categories, Characteristic, CharacteristicEventTypes, Service, WithUUID } from 'hap-nodejs';
import { InsteonFanDevice } from 'isy-nodejs';

import { ISYDeviceAccessory } from './ISYDeviceAccessory';

export class ISYFanAccessory extends ISYDeviceAccessory<InsteonFanDevice, Categories.FAN> {
	public fanService: Service;
	public lightService: Service;
	constructor (device: InsteonFanDevice) {
		super(device);
		this.category = Categories.FAN;
		// device.propertyChanged.removeListener(null, super.handleExternalChange);
		// this.device.Motor.onPropertyChanged(null, this.handleExternalChangeToMotor.bind(this));
		// this.device.Light.onPropertyChanged(null, this.handleExternalChangeToLight.bind(this));
		// this.logger(JSON.stringify(this.device.scenes[0]));
	}
	// Translates the fan level from homebridge into the isy-nodejs level. Maps from the 0-100
	// to the four isy-nodejs fan speed levels.

	public map(propertyName, propertyValue) {
		//super.map(propertyName,propertyValue);
		if (propertyName === 'motor.ST') {
			return { characteristicValue: propertyValue, characteristic: Characteristic.RotationSpeed, service: this.fanService };
		} else if (propertyName === 'light.ST') {
			return { characteristicValue: propertyValue, characteristic: Characteristic.Brightness, service: this.lightService };
		}

	}

	// Handles a request to get the current brightness level for dimmable lights.

	public handlePropertyChange(propertyName: string, value: any, oldValue: any, formattedValue: any) {
		super.handlePropertyChange(propertyName, value, oldValue, formattedValue);
		this.fanService.getCharacteristic(Characteristic.On).updateValue(this.device.motor.isOn);
		this.lightService.getCharacteristic(Characteristic.On).updateValue(this.device.light.isOn);
		//this.fanService.getCharacteristic(Characteristic.RotationSpeed).updateValue(this.device.motor.fanSpeed);
	}

	// Mirrors change in the state of the underlying isj-js device object.

	// Returns the services supported by the fan device.
	public setupServices() {
		super.setupServices();
		const fanService = this.platformAccessory.getOrAddService(Service.Fan);
		this.fanService = fanService;
		const lightService = this.platformAccessory.getOrAddService(Service.Lightbulb);
		this.lightService = lightService;
		fanService.getCharacteristic(Characteristic.RotationSpeed).onSet(this.device.motor.updateFanSpeed.bind(this.device.motor)).onGet(() => this.device.motor.fanSpeed).setProps(
			{
				minStep: 25,
			},
		);
		fanService.getCharacteristic(Characteristic.On).onSet(this.device.motor.updateIsOn.bind(this.device.motor)).onGet(() => this.device.motor.isOn);
		lightService.getCharacteristic(Characteristic.On).onSet(this.device.light.updateIsOn.bind(this.device.light)).onGet(() => this.device.light.isOn);
		lightService.getCharacteristic(Characteristic.Brightness).onSet(this.device.light.updateBrightnessLevel.bind(this.device.light)).onGet(() => this.device.light.brightnessLevel);
		fanService.isPrimaryService = true;
		this.primaryService = fanService;

	}
}
