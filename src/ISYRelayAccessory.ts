import { Categories, Characteristic, Service } from 'hap-nodejs';
import { InsteonDimmableDevice, InsteonRelayDevice } from 'isy-js';
import { ISYDeviceAccessory } from './ISYDeviceAccessory';
import './utils';

export class ISYRelayAccessory<T extends InsteonRelayDevice> extends ISYDeviceAccessory<T, Categories.SWITCH | Categories.LIGHTBULB | Categories.OUTLET> {

	constructor(device: T) {
		super(device);
		this.category = Categories.SWITCH;
		this.dimmable = device instanceof InsteonDimmableDevice;

	}

	public map(propertyName: keyof T): { characteristic: typeof Characteristic, service: Service; } {
		const o = super.map(propertyName);
		if (o) {
			o.characteristic = Characteristic.On;
		}
		return o;
	}

	// Mirrors change in the state of the underlying isj-js device object.
	// public handleExternalChange(propertyName: string, value: any, formattedValue: string) {
		// super.handleExternalChange(propertyName, value, formattedValue);
		// l
		// this.primaryService.getCharacteristic(Characteristic.On).updateValue(this.device.isOn);
	// }

	// Returns the set of services supported by this object.
	public setupServices() {
		super.setupServices();
		this.primaryService = this.platformAccessory.getOrAddService(Service.Switch);
		this.primaryService.getCharacteristic(Characteristic.On).onGet(() => this.device.isOn).onSet(this.bind(this.device.updateIsOn));


	}
}
