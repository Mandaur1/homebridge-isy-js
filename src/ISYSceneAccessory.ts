import './utils';

import { Categories, Characteristic, CharacteristicEventTypes, Service } from 'hap-nodejs';
import { StatelessProgrammableSwitch, Switch } from 'hap-nodejs/dist/lib/gen/HomeKit';
import { StatefulProgrammableSwitch } from 'hap-nodejs/dist/lib/gen/HomeKit-Bridge';
import { ISYScene } from 'isy-js';

import { ISYAccessory } from './ISYAccessory';
import { onSet } from './utils';

export class ISYSceneAccessory extends ISYAccessory<ISYScene,Categories.PROGRAMMABLE_SWITCH> {
	public dimmable: boolean;
	public lightService: StatefulProgrammableSwitch | Switch;
	public scene: ISYScene;
	constructor (scene: ISYScene) {
		super(scene);

		this.scene = scene;
		this.dimmable = scene.isDimmable;
		// this.logger = function(msg) {log("Scene Accessory: " + scene.name + ": " + msg); };
	}
	// Handles the identify command
	public identify(callback: (...any: any[]) => void) {
		const that = this;
	}
	// Handles request to set the current powerstate from homekit. Will ignore redundant commands.
	
	// Mirrors change in the state of the underlying isj-js device object.
	public handleExternalChange(propertyName: string, value: any, formattedValue: string) {
		this.lightService.getCharacteristic(Characteristic.On).updateValue(this.scene.isOn);
		if (this.dimmable) {
			this.lightService.getCharacteristic(Characteristic.Brightness).updateValue(this.scene.brightnessLevel);
		}
	}
	// Handles request to get the current on state
	public getPowerState(callback: (...any: any[]) => void) {
		callback(null, this.scene.isOn);
	}
	// Returns the set of services supported by this object.
	public setupServices() {
		super.setupServices();

		if (this.dimmable) {
			this.lightService = this.platformAccessory.getOrAddService(Service.Lightbulb);
			onSet(this.lightService.getCharacteristic(Characteristic.Brightness), this.bind(this.device.updateBrightnessLevel)).onGet(() => this.device.brightnessLevel);

		} else {
			this.lightService = this.platformAccessory.getOrAddService(Switch);
		}
		this.lightService
			.getCharacteristic(Characteristic.On)
			.onGet(() => this.device.isOn).onSet(this.bind(this.device.updateIsOn));
		return [this.informationService, this.lightService];
	}
}
