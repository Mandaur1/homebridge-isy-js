import { Characteristic } from 'homebridge';
import { InsteonDoorWindowSensorDevice } from 'isy-js';

import { ISYDeviceAccessory } from './ISYDeviceAccessory';
import { Service } from './plugin';

export class ISYDoorWindowSensorAccessory extends ISYDeviceAccessory<InsteonDoorWindowSensorDevice> {
	public doorWindowState: boolean;
	public sensorService: any;
	constructor(log: (msg: any) => void, device: InsteonDoorWindowSensorDevice) {
		super(log, device);
		this.doorWindowState = false;
	}
	// Handles the identify command.
	// Translates the state of the underlying device object into the corresponding homekit compatible state
	public translateCurrentDoorWindowState() {
		return this.device.isOpen ? Characteristic.ContactSensorState.CONTACT_NOT_DETECTED : Characteristic.ContactSensorState.CONTACT_DETECTED;
	}
	// Handles the request to get he current door window state.
	public getCurrentDoorWindowState(callback) {
		callback(null, this.translateCurrentDoorWindowState());
	}
	// Mirrors change in the state of the underlying isj-js device object.
	public handleExternalChange(propertyName: string, value: any, formattedValue: string) {
		super.handleExternalChange(propertyName, value, formattedValue);
		this.sensorService.setCharacteristic(Characteristic.ContactSensorState, this.translateCurrentDoorWindowState());
	}
	// Returns the set of services supported by this object.
	public getServices() {
		super.getServices();
		const sensorService = new Service.ContactSensor();
		this.sensorService = sensorService;
		sensorService.getCharacteristic(Characteristic.ContactSensorState).on('get', this.getCurrentDoorWindowState.bind(this));
		return [this.informationService, sensorService];
	}
}
