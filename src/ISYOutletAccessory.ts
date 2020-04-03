import './utils';

import { Categories, Characteristic, CharacteristicEventTypes, Service } from 'hap-nodejs';
import { InsteonOutletDevice } from 'isy-js';

import { ISYDeviceAccessory } from './ISYDeviceAccessory';

export class ISYOutletAccessory extends ISYDeviceAccessory<InsteonOutletDevice,Categories.OUTLET> {
	public outletService: any;
	constructor(device: InsteonOutletDevice) {
		super(device);
	}
	// Handles the identify command
	// Handles a request to set the outlet state. Ignores redundant sets based on current states.
	public setOutletState(outletState: boolean, callback: (...any: any[]) => any) {
		this.log.info(`OUTLET: Sending command to set outlet state to: ${outletState}`);
		if (outletState !== this.device.isOn) {
			this.device
				.updateIsOn(outletState)
				.then(callback(true))
				.catch(callback(false));
		} else {
			callback();
		}
	}
	// Handles a request to get the current outlet state based on underlying isy-js device object.
	public getOutletState(callback: (...any: any[]) => void){
		callback(null, this.device.isOn);
	}
	// Handles a request to get the current in use state of the outlet. We set this to true always as
	// there is no way to deterine this through the isy.
	public getOutletInUseState(callback: (...any: any[]) => void){
		callback(null, true);
	}
	// Mirrors change in the state of the underlying isj-js device object.
	public handleExternalChange(propertyName: string, value: any, formattedValue: string) {
		super.handleExternalChange(propertyName, value, formattedValue);
		this.outletService.updateCharacteristic(Characteristic.On, this.device.isOn);
	}
	// Returns the set of services supported by this object.
	public setupServices() {
		super.setupServices();
		const outletService = this.platformAccessory.getOrAddService(Service.Outlet);
		this.outletService = outletService;
		outletService.getCharacteristic(Characteristic.On).onSet(this.bind(this.device.updateIsOn));
		outletService.getCharacteristic(Characteristic.On).onGet(() => this.device.isOn);
		outletService.getCharacteristic(Characteristic.OutletInUse).onGet(() => true);
		return [this.informationService, outletService];
	}
}
