import { Categories, Characteristic, Service } from 'hap-nodejs';
import { InsteonDimmableDevice } from 'isy-nodejs';
import { ISYRelayAccessory } from './ISYRelayAccessory';
import './utils';

export class InsteonDimmableAccessory<T extends InsteonDimmableDevice> extends ISYRelayAccessory<T> {
	constructor(device: T) {

		super(device);
		this.category = Categories.LIGHTBULB;
	}
	// Handles the identify command
	// Handles request to set the current powerstate from homekit. Will ignore redundant commands.
	public map(propertyName: keyof T): { characteristic: typeof Characteristic, service: Service; } {
		const o = super.map(propertyName);
		if (o) {
			o.characteristic = Characteristic.Brightness;
		}
		return o;
	}

	// Mirrors change in the state of the underlying isj-js device object.
	public handleExternalChange(propertyName: string, value, formattedValue) {
		super.handleExternalChange(propertyName, value, formattedValue);
		this.primaryService.getCharacteristic(Characteristic.On).updateValue(this.device.isOn);
		// this.a
			// this.primaryService.getCharacteristic(ch.name).updateValue(this.device[propertyName]);

	}
	// Handles request to get the current on state
	// Handles request to get the current on state

	// Handles a request to get the current brightness level for dimmable lights.
	public getBrightness(callback: (...any) => void) {
		callback(null, this.device.level);

	}
	// Returns the set of services supported by this object.
	public setupServices() {
		const s = super.setupServices();

		this.platformAccessory.removeService(this.primaryService);
		this.primaryService = this.platformAccessory.getOrAddService(Service.Lightbulb);
		this.primaryService.getCharacteristic(Characteristic.On).onSet(this.bind(this.device.updateIsOn));
		this.primaryService.getCharacteristic(Characteristic.On).onGet(() => this.device.isOn);
		// lightBulbService.getCharacteristic(Characteristic.On).on('get', this.getPowerState.bind(this));
		// this.primaryService.getCharacteristic(Characteristic.Brightness).updateValue(this.device['OL']);
		this.primaryService.getCharacteristic(Characteristic.Brightness).onGet(() => this.device.brightnessLevel);
		this.primaryService.getCharacteristic(Characteristic.Brightness).onSet(this.bind(this.device.updateBrightnessLevel));
		// this.primaryService.getCharacteristic(Characteristic.Brightness).setProps({maxValue: this.device.OL});

	}
}
