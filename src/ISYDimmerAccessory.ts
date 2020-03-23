import './utils';

import { Characteristic, CharacteristicEventTypes, Service } from 'hap-nodejs';
import { Controls, InsteonDimmableDevice } from 'isy-js';

import { ISYRelayAccessory } from './ISYRelayAccessory';

export class InsteonDimmableAccessory<T extends InsteonDimmableDevice> extends ISYRelayAccessory<T> {
	constructor(log: any, device: T) {
		super(log, device);

	}
	// Handles the identify command
	// Handles request to set the current powerstate from homekit. Will ignore redundant commands.
	toCharacteristic(propertyName: string) : typeof Characteristic
	{
		if(propertyName === 'ST')
			return Characteristic.Brightness;
		return null;
	}
	// Mirrors change in the state of the underlying isj-js device object.
	public handleExternalChange(propertyName: string, value, formattedValue) {
		super.handleExternalChange(propertyName, value, formattedValue);
		//this.primaryService.getCharacteristic(Characteristic.On).updateValue(this.device.isOn);

		if(propertyName !== null && propertyName !== undefined)
			this.primaryService.getCharacteristic(this.toCharacteristic(propertyName).name).updateValue(this.device[propertyName]);

	}
	// Handles request to get the current on state
	// Handles request to get the current on state


	// Handles a request to get the current brightness level for dimmable lights.
	public getBrightness(callback: (...any) => void) {
		callback(null, this.device.level);

	}
	// Returns the set of services supported by this object.
	public getServices() : Service[] {
		const s = super.getServices();
		this.primaryService.removeAllListeners();
		this.removeService(this.primaryService);
		this.primaryService = this.addService(Service.Lightbulb);
		this.primaryService.getCharacteristic(Characteristic.On).onSet(this.device.updateIsOn.bind(this.device));
		this.primaryService.getCharacteristic(Characteristic.On).on(CharacteristicEventTypes.GET,this.getPowerState.bind(this));
		// lightBulbService.getCharacteristic(Characteristic.On).on('get', this.getPowerState.bind(this));
		//this.primaryService.getCharacteristic(Characteristic.Brightness).updateValue(this.device['OL']);
		this.primaryService.getCharacteristic(Characteristic.Brightness).onGet(() => this.device.brightnessLevel);
		this.primaryService.getCharacteristic(Characteristic.Brightness).onSet(this.device.updateBrightnessLevel.bind(this.device));
		//this.primaryService.getCharacteristic(Characteristic.Brightness).setProps({maxValue: this.device.OL});
		return [this.informationService, this.primaryService];
	}
}
