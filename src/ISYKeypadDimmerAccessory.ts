import { Categories } from 'hap-nodejs';
import { InsteonDimmableDevice, InsteonKeypadDimmerDevice } from 'isy-nodejs';
import { ISYDimmableAccessory } from './ISYDimmableAccessory';
import { ISYRelayAccessory } from './ISYRelayAccessory';
import './utils';

import { ButtonEvent } from 'hap-nodejs/dist/lib/gen/HomeKit-Remote';

import { Characteristic, generate, Service } from './plugin';
import { ISYPlatform } from './ISYPlatform';

export class ISYKeypadDimmerAccessory<T extends  InsteonKeypadDimmerDevice> extends ISYDimmableAccessory<T> {
	constructor(device: T, platform: ISYPlatform) {
		``
		super(device, platform);
		this.UUID = generate(`${device.isy.address}:${device.address}0`);
		this.category = Categories.LIGHTBULB;
		this.displayName =  this.device.displayName;

		// this.category = Categories.Pro
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

	// Handles request to get the current on state
	// Handles request to get the current on state

	// Handles a request to get the current brightness level for dimmable lights.

	// Returns the set of services supported by this object.
	public setupServices() {

		const s = super.setupServices();
		const self = this;
		// this.platformAccessory.removeService(this.primaryService);
		let index = 1;
		for (const child of this.device.children) {
			const serv = this.platformAccessory.getServiceByUUIDAndSubType(Service.StatelessProgrammableSwitch, child.address);
			const service = serv ?? this.platformAccessory.addService(new Service.StatelessProgrammableSwitch(child.displayName, child.address));
			index++;
			service.getCharacteristic(Characteristic.ServiceLabelIndex).updateValue(index);
			child.on('ControlTriggered', (controlName: string) => {

				switch (controlName) {
					case 'DON':
						self.logger('DON recieved. Mapping to SINGLE_PRESS.');
						service.getCharacteristic(Characteristic.ProgrammableSwitchEvent).setValue(Characteristic.ProgrammableSwitchEvent.SINGLE_PRESS);
						break;
					case 'DFON':
						self.logger('DFON recieved. Mapping to DOUBLE_PRESS.');
						service.getCharacteristic(Characteristic.ProgrammableSwitchEvent).setValue(Characteristic.ProgrammableSwitchEvent.DOUBLE_PRESS);
						break;
					case 'BRT':
						self.logger('BRT recieved. Mapping to LONG_PRESS.');
						service.getCharacteristic(Characteristic.ProgrammableSwitchEvent).setValue(Characteristic.ProgrammableSwitchEvent.LONG_PRESS);
						break;

				}
			});
		}
		const s1 = this.platformAccessory.getServiceByUUIDAndSubType(Service.StatelessProgrammableSwitch, this.device.address) ?? this.platformAccessory.addService(new Service.StatelessProgrammableSwitch(this.device.displayName + ' (Button)', this.device.address));
		s1.getCharacteristic(Characteristic.ServiceLabelIndex).updateValue(1);
		this.device.on('ControlTriggered',  (controlName: string) => {
			switch (controlName) {
				case 'DON':
					s1.getCharacteristic(Characteristic.ProgrammableSwitchEvent).setValue(Characteristic.ProgrammableSwitchEvent.SINGLE_PRESS);
					break;
				case 'DFON':
					s1.getCharacteristic(Characteristic.ProgrammableSwitchEvent).setValue(Characteristic.ProgrammableSwitchEvent.DOUBLE_PRESS);
					break;
				case 'BRT':
					s1.getCharacteristic(Characteristic.ProgrammableSwitchEvent).setValue(Characteristic.ProgrammableSwitchEvent.LONG_PRESS);
					break;

			}
		});

		this.platformAccessory.category = Categories.LIGHTBULB;
		this.primaryService.setPrimaryService(true);
		this.platformAccessory._associatedHAPAccessory.setPrimaryService(this.primaryService);
		// this.primaryService.getCharacteristic(Characteristic.Brightness).setProps({maxValue: this.devi;ce.OL});

	}
}
