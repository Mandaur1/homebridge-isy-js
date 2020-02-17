import { Characteristic, CharacteristicEventTypes, Service } from 'homebridge/node_modules/hap-nodejs';
import { InsteonDimmableDevice } from 'isy-js';

import { ISYRelayAccessory } from './ISYRelayAccessory';
import './utils';

export class ISYDimmableAccessory<T extends InsteonDimmableDevice> extends ISYRelayAccessory<T> {
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
		
		this.primaryService.getCharacteristic(Characteristic.Brightness).updateValue(this.device.level);

	}
	// Handles request to get the current on state
	// Handles request to get the current on state

	// Handles request to set the brightness level of dimmable lights. Ignore redundant commands.
	public setBrightness(level: number, callback: (...any: any[]) => void) {
		this.logger(`Setting brightness to ${level}`);
		if (level !== this.device.brightnessLevel) {
			this.device
				.updateBrightnessLevel(level).handleWith(callback);
		} else {
			this.logger(`Ignoring redundant setBrightness`);
			callback();
		}
	}
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
		this.primaryService.getCharacteristic(Characteristic.Brightness).on(CharacteristicEventTypes.GET, this.getBrightness.bind(this));
		this.primaryService.getCharacteristic(Characteristic.Brightness).onSet(this.device.updateBrightnessLevel.bind(this.device));
		
		return [this.informationService, this.primaryService];
	}
}
