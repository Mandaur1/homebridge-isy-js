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

	// Mirrors change in the state of the underlying isj-js device object.
	public handleExternalChange(propertyName: string, value: any, formattedValue: string) {
		super.handleExternalChange(propertyName, value, formattedValue);
		this.primaryService.getCharacteristic(Characteristic.On).updateValue(this.device.isOn);
	}

	// Returns the set of services supported by this object.
	public setupServices() {
		const s = super.setupServices();
		this.primaryService = this.platformAccessory.getOrAddService(Service.Switch);
		this.primaryService.getCharacteristic(Characteristic.On).onGet(() => this.device.isOn).onSet(this.bind(this.device.updateIsOn));
		s.push(this.primaryService);
		return s;
	}
}
