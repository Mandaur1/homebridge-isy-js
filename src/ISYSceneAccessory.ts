import { ISYScene } from 'isy-js';

import { ISYAccessory } from './ISYAccessory';
import { Characteristic, onSet, Service } from './plugin';

export class ISYSceneAccessory extends ISYAccessory<ISYScene> {
	public dimmable: boolean;
	public lightService: HAPNodeJS.Service;
	public scene: ISYScene;
	constructor(log: (msg: any) => void, scene: ISYScene) {
		super(log, scene);
		this.scene = scene;
		this.dimmable = scene.isDimmable;
		// this.logger = function(msg) {log("Scene Accessory: " + scene.name + ": " + msg); };
	}
	// Handles the identify command
	public identify(callback: (...any: any[]) => void)  {
		const that = this;
	}
	// Handles request to set the current powerstate from homekit. Will ignore redundant commands.
	public setPowerState(powerOn: boolean, callback: (...any) => void) {
		this.logger(`Setting powerstate to ${powerOn}`);
		if (this.scene.isOn !== powerOn) {
			this.logger(`Changing powerstate to ${powerOn}`);
			this.scene.updateBrightnessLevel(powerOn).handleWith(callback);
		} else {
			this.logger(`Ignoring redundant setPowerState`);
			callback();
		}
	}
	public setBrightness(level: number, callback: (...any) => void) {
		this.logger(`Setting brightness to ${level}`);
		if (level !== this.scene.brightnessLevel) {
			this.scene.updateBrightnessLevel(level).handleWith(callback);
		} else {
			this.logger(`Ignoring redundant setBrightness`);
			callback();
		}
	}
	// Handles a request to get the current brightness level for dimmable lights.
	public getBrightness(callback: (...any) => void) {
		callback(null, this.scene.brightnessLevel);
	}
	// Mirrors change in the state of the underlying isj-js device object.
	public handleExternalChange(propertyName: string, value: any, formattedValue: string) {
		this.lightService.updateCharacteristic(Characteristic.On, this.scene.isOn);
		if (this.dimmable) {
			this.lightService.updateCharacteristic(Characteristic.Brightness, this.scene.brightnessLevel);
		}
	}
	// Handles request to get the current on state
	public getPowerState(callback: (...any: any[]) => void)  {
		callback(null, this.scene.isOn);
	}
	// Returns the set of services supported by this object.
	public getServices() {
		super.getServices();

		if (this.dimmable) {
			this.lightService = new Service.Lightbulb();

			onSet(this.lightService.addCharacteristic(Characteristic.Brightness).on('get', (f) => this.getBrightness(f)), (this.device.updateBrightnessLevel));
		} else {
			this.lightService = new Service.Switch();
		}
		this.lightService
			.getCharacteristic(Characteristic.On)
			.on('set', this.setPowerState.bind(this))
			.on('get', this.getPowerState.bind(this));
		return [this.informationService, this.lightService];
	}
}
