import { Categories, Characteristic, Service } from 'hap-nodejs';
import { InsteonDimmableDevice, InsteonKeypadDimmerDevice } from 'isy-nodejs';
import { ISYRelayAccessory } from './ISYRelayAccessory';
import './utils';
import { ISYDimmableAccessory } from './ISYDimmableAccessory';
import { ProgrammableSwitchEvent } from 'hap-nodejs/dist/lib/gen/HomeKit';
import { ButtonEvent } from 'hap-nodejs/dist/lib/gen/HomeKit-Remote';
import { generate } from 'hap-nodejs/dist/lib/util/uuid';

export class ISYKeypadDimmerAccessory<T extends  InsteonKeypadDimmerDevice> extends ISYDimmableAccessory<T> {
	constructor(device: T) {

		super(device);
		this.UUID = generate(`${device.isy.address}:${device.address}0`);
		this.category = Categories.LIGHTBULB;
		this.displayName =  super.displayName + ' (Buttons)';

		//this.category = Categories.Pro
	}
	// Handles the identify command
	// Handles request to set the current powerstate from homekit. Will ignore redundant commands.
	public map(propertyName: keyof T, propertyValue: any) {
		const o = super.map(propertyName, propertyValue);
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

		//this.platformAccessory.removeService(this.primaryService);
		for(const child of this.device.children)
		{
			let serv = this.platformAccessory.getServiceByUUIDAndSubType(Service.StatelessProgrammableSwitch, child.name);
			const service = serv ?? this.platformAccessory.addService(new Service.StatelessProgrammableSwitch(child.displayName,child.name));
			const self = this;
			child.on('ControlTriggered',(controlName: string) =>
			{

				switch (controlName) {
					case 'DON':
						self.logger('DON recieved. Mapping to SINGLE_PRESS.');
						service.getCharacteristic(Characteristic.ProgrammableSwitchEvent).updateValue(ProgrammableSwitchEvent.SINGLE_PRESS);
						break;
					case 'DFON':
						self.logger('DON recieved. Mapping to DOUBLE_PRESS.');
						service.getCharacteristic(Characteristic.ProgrammableSwitchEvent).updateValue(ProgrammableSwitchEvent.DOUBLE_PRESS);
						break;
					case 'BRT':
						service.getCharacteristic(Characteristic.ProgrammableSwitchEvent).updateValue(ProgrammableSwitchEvent.LONG_PRESS);
						break;


				}
			});
		}
		const s1 = this.platformAccessory.getServiceByUUIDAndSubType(Service.StatelessProgrammableSwitch, this.device.name) ?? this.platformAccessory.addService(new Service.StatelessProgrammableSwitch(this.device.displayName + " (Button)", this.device.name));
		this.device.on('ControlTriggered',  (controlName) => {
			switch (controlName) {
				case 'DON':
					s1.getCharacteristic(Characteristic.ProgrammableSwitchEvent).updateValue(ProgrammableSwitchEvent.SINGLE_PRESS);
					break;
				case 'DFON':
					s1.getCharacteristic(Characteristic.ProgrammableSwitchEvent).updateValue(ProgrammableSwitchEvent.DOUBLE_PRESS);
					break;
				case 'BRT':
					s1.getCharacteristic(Characteristic.ProgrammableSwitchEvent).updateValue(ProgrammableSwitchEvent.LONG_PRESS);
					break;


			}
		});
		//this.primaryService = this.platformAccessory.getOrAddService(Service.Lightbulb);
		//this.primaryService.getCharacteristic(Characteristic.On).onSet(this.bind(this.device.updateIsOn));
		//this.primaryService.getCharacteristic(Characteristic.On).onGet(() => this.device.isOn);
		// lightBulbService.getCharacteristic(Characteristic.On).on('get', this.getPowerState.bind(this));
		// this.primaryService.getCharacteristic(Characteristic.Brightness).updateValue(this.device['OL']);
		//this.primaryService.getCharacteristic(Characteristic.Brightness).onGet(() => this.device.brightnessLevel);
		//this.primaryService.getCharacteristic(Characteristic.Brightness).onSet(this.bind(this.device.updateBrightnessLevel)).setProps(
			//{}
		//);
		this.platformAccessory.category = Categories.LIGHTBULB;
		this.primaryService.setPrimaryService(true);
		this.platformAccessory._associatedHAPAccessory.setPrimaryService(this.primaryService);
		// this.primaryService.getCharacteristic(Characteristic.Brightness).setProps({maxValue: this.devi;ce.OL});

	}
}
