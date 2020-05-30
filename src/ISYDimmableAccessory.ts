
import { Categories } from 'hap-nodejs';
import { InsteonDimmableDevice } from 'isy-nodejs';
import { ISYPlatform } from './ISYPlatform';
import { ISYRelayAccessory } from './ISYRelayAccessory';
import { Characteristic, Service } from './plugin';
import './utils';

export class ISYDimmableAccessory<T extends InsteonDimmableDevice> extends ISYRelayAccessory<T> {
	constructor(device: T, platform: ISYPlatform)  {
		super(device, platform);
		this.category = Categories.LIGHTBULB;
	}
	// Handles the identify command

	public map(propertyName: keyof T, propertyValue: any) {
		const o = super.map(propertyName, propertyValue);
		if (o) {
			o.characteristic = Characteristic.Brightness;
			o.characteristicValue = propertyValue;
		}
		return o;
	}

	// Mirrors change in the state of the underlying isj-js device object.
	public handleExternalChange(propertyName: string, value, formattedValue) {
		this.primaryService.updateCharacteristic(Characteristic.On,this.device.isOn);
		super.handleExternalChange(propertyName, value, formattedValue);
	}

	// Returns the set of services supported by this object.
	public setupServices() {
		const s = super.setupServices();

		this.platformAccessory.removeService(this.primaryService);
		this.primaryService = this.platformAccessory.getOrAddService(Service.Lightbulb);
		this.primaryService.getCharacteristic(Characteristic.On).onSet(this.bind(this.device.updateIsOn));
		this.primaryService.getCharacteristic(Characteristic.On).onGet(() => this.device.isOn);
		this.primaryService.getCharacteristic(Characteristic.Brightness).onGet(() => this.device.brightnessLevel);
		this.primaryService.getCharacteristic(Characteristic.Brightness).onSet(this.bind(this.device.updateBrightnessLevel)).setProps(
			{},
		);
		// this.primaryService.getCharacteristic(Characteristic.Brightness).setProps({maxValue: this.device.OL});

	}
}
