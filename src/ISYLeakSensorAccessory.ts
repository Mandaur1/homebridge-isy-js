import './utils';

import { Categories, Characteristic, Service } from 'hap-nodejs';
import { InsteonDoorWindowSensorDevice, InsteonLeakSensorDevice } from 'isy-nodejs';

import { ISYDeviceAccessory } from './ISYDeviceAccessory';





export class ISYLeakSensorAccessory extends ISYDeviceAccessory<InsteonLeakSensorDevice,Categories.SENSOR> {


	constructor (device: InsteonLeakSensorDevice) {
		super(device);
		this.doorWindowState = false;
	}
	// Handles the identify command.
	// Translates the state of the underlying device object into the corresponding homekit compatible state

	// Mirrors change in the state of the underlying isj-js device object.
	public handleExternalChange(propertyName: string, value: any,  oldValue: any, formattedValue: string) {
		super.handleExternalChange(propertyName, value, oldValue, formattedValue);
		this.primaryService.getCharacteristic(Characteristic.CurrentDoorState).updateValue(!this.device.leakDetected ? 1 : 0);
	}
	// Returns the set of services supported by this object.
	public setupServices() {
		super.setupServices();

		const sensorService = this.platformAccessory.getOrAddService(Service.ContactSensor);
		this.primaryService = sensorService;
		sensorService.getCharacteristic(Characteristic.ContactSensorState).onGet(() => this.device.leakDetected);

	}
}
