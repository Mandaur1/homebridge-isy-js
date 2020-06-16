import './ISYPlatform';

import { Categories } from 'hap-nodejs';
import { InsteonFanDevice } from 'isy-nodejs';

import { Fan, Lightbulb } from 'hap-nodejs/dist/lib/gen/HomeKit';
import { ISYDeviceAccessory } from './ISYDeviceAccessory';
import { ISYPlatform } from './ISYPlatform';
import { Characteristic, Service } from './plugin';

export class ISYFanAccessory extends ISYDeviceAccessory<InsteonFanDevice, Categories.FAN> {
	public fanService: Fan;
	public lightService: Lightbulb;
	constructor(device: InsteonFanDevice, platform: ISYPlatform) {
		super(device, platform);
		this.category = Categories.FAN;

	}

	public map(propertyName, propertyValue) {
		
		if (propertyName === 'motor.ST') {
			return { characteristicValue: propertyValue, characteristic: Characteristic.RotationSpeed, service: this.fanService };
		} else if (propertyName === 'light.ST') {
			return { characteristicValue: propertyValue, characteristic: Characteristic.Brightness, service: this.lightService };
		}

	}

	public handlePropertyChange(propertyName: string, value: any, oldValue: any, formattedValue: any) {
		super.handlePropertyChange(propertyName, value, oldValue, formattedValue);
		this.fanService.getCharacteristic(Characteristic.On).updateValue(this.device.motor.isOn);
		this.lightService.getCharacteristic(Characteristic.On).updateValue(this.device.light.isOn);
	}

	// Mirrors change in the state of the underlying isj-js device object.

	// Returns the services supported by the fan device.
	public setupServices() {
		super.setupServices();
		const fanService = this.platformAccessory.getOrAddService(Service.Fan);
		this.fanService = fanService;
		const lightService = this.platformAccessory.getOrAddService(Service.Lightbulb);
		this.lightService = lightService;
		fanService.getCharacteristic(Characteristic.RotationSpeed).onSet(this.device.motor.updateFanSpeed.bind(this.device.motor)).onGet((() => this.device.motor.fanSpeed).bind(this)).setProps(
			{
				minStep: 25,

			},
		);
		fanService.getCharacteristic(Characteristic.On).onSet(this.device.motor.updateIsOn.bind(this.device.motor)).onGet((() => this.device.motor.isOn).bind(this));
		lightService.getCharacteristic(Characteristic.On).onSet(this.device.light.updateIsOn.bind(this.device.light)).onGet((() => this.device.light.isOn).bind(this));
		lightService.getCharacteristic(Characteristic.Brightness).onSet(this.device.light.updateBrightnessLevel.bind(this.device.light)).onGet((() => this.device.light.brightnessLevel).bind(this));
		fanService.isPrimaryService = true;
		this.primaryService = fanService;

	}
}
