import './utils';

import { Categories, Characteristic, CharacteristicEventTypes, Service } from 'hap-nodejs';
import { InsteonDimmableDevice, InsteonRelayDevice } from 'isy-js';

import { ISYDeviceAccessory } from './ISYDeviceAccessory';

export class ISYRelayAccessory<T extends InsteonRelayDevice> extends ISYDeviceAccessory<T,Categories.SWITCH> {
	public primaryService: Service;

	constructor(device: T) {
		super(device);

		this.dimmable = device instanceof InsteonDimmableDevice;
	}
	// Handles the identify command
	// Handles request to set the current powerstate from homekit. Will ignore redundant commands.
	public setPowerState(powerOn: boolean, callback: (...any: any[]) => void)  {
		if (powerOn !== this.device.isOn) {
			this.device
				.updateIsOn(powerOn).handleWith(callback);
		} else {
			this.logger(`Ignoring redundant setPowerState`);
			callback();
		}
	}
	// Mirrors change in the state of the underlying isj-js device object.
	public handleExternalChange(propertyName: string, value: any, formattedValue: string) {
		super.handleExternalChange(propertyName, value, formattedValue);
		this.primaryService.getCharacteristic(Characteristic.On).updateValue(this.device.isOn);
	}
	// Handles request to get the current on state
	// Handles request to get the current on state
	public getPowerState(callback: (...any: any[]) => void) {
		callback(null, this.device.isOn);
	}
	// Handles request to set the brightness level of dimmable lights. Ignore redundant commands.
	public setBrightness(level: any, callback: (...any: any[])  => void) {
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
	public getBrightness(callback: (...any: any[]) => void){
		callback(null, this.device.brightnessLevel);
	}
	// Returns the set of services supported by this object.
	public setupServices() {
		const s = super.setupServices();
		this.primaryService = this.platformAccessory.getOrAddService(Service.Switch);
		this.primaryService.getCharacteristic(Characteristic.On).on(CharacteristicEventTypes.SET, this.setPowerState.bind(this));
		this.primaryService.getCharacteristic(Characteristic.On).on(CharacteristicEventTypes.GET, this.getPowerState.bind(this));
		s.push(this.primaryService);
		return s;
	}
}
