import './utils';

import { ISYScene } from 'isy-nodejs';

import { Categories } from 'homebridge';
import { ISYAccessory } from './ISYAccessory';
import { Characteristic, Service } from './plugin';
import { onSet } from './utils';

export class ISYSceneAccessory extends ISYAccessory<ISYScene, Categories.LIGHTBULB> {
	public dimmable: boolean;


	constructor(scene: ISYScene, platform) {
		super(scene, platform);
		this.category = Categories.LIGHTBULB;

		this.dimmable = scene.isDimmable;

		// this.logger = function(msg) {log("Scene Accessory: " + scene.name + ": " + msg); };
	}
	// Handles the identify command
	public identify() {
		const that = this;
	}
	// Handles request to set the current powerstate from homekit. Will ignore redundant commands.

	// Mirrors change in the state of the underlying isj-js device object.
	public handlePropertyChange(propertyName: string, value: any, oldValue: any, formattedValue: string) {

		this.primaryService.getCharacteristic(Characteristic.On).updateValue(this.device.isOn);
		if (this.dimmable) {
			this.primaryService.getCharacteristic(Characteristic.Brightness).updateValue(this.device.brightnessLevel);
		}
	}
	// Handles request to get the current on state

	// Returns the set of services supported by this object.
	public setupServices() {
		super.setupServices();

		if (this.dimmable) {
			this.primaryService = this.platformAccessory.getOrAddService(Service.Lightbulb);
			onSet(this.primaryService.getCharacteristic(Characteristic.Brightness), this.bind(this.device.updateBrightnessLevel)).onGet(() => this.device.brightnessLevel);

		} else {
			this.primaryService = this.platformAccessory.getOrAddService(Service.Switch);
		}
		this.primaryService
			.getCharacteristic(Characteristic.On)
			.onGet(() => this.device.isOn).onSet(this.bind(this.device.updateIsOn));

	}
}
