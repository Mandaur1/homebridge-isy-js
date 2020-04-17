import './utils';

import { Categories, Characteristic, Service } from 'hap-nodejs';
import { InsteonDoorWindowSensorDevice } from 'isy-nodejs';

import { ISYDeviceAccessory } from './ISYDeviceAccessory';



export class ISYDoorWindowSensorAccessory extends ISYDeviceAccessory<InsteonDoorWindowSensorDevice,Categories.SENSOR> {


	constructor(device: InsteonDoorWindowSensorDevice) {
		super(device);
		this.doorWindowState = false;
	}
	// Handles the identify command.
	// Translates the state of the underlying device object into the corresponding homekit compatible state
	public translateCurrentDoorWindowState()  {

		return this.device.isOpen;
	}
	// Handles the request to get he current door window state.
	public getCurrentDoorWindowState(callback) {
		callback(null, this.translateCurrentDoorWindowState());
	}
	// Mirrors change in the state of the underlying isj-js device object.
	public handleExternalChange(propertyName: string, value: any, formattedValue: string) {
		super.handleExternalChange(propertyName, value, formattedValue);
		this.primaryService.getCharacteristic(Characteristic.CurrentDoorState).updateValue(!this.device.isOpen ? 1 : 0);
	}
	// Returns the set of services supported by this object.
	public setupServices() {
		super.setupServices();

		const sensorService = this.platformAccessory.getOrAddService(Service.ContactSensor);
		this.primaryService = sensorService;
		sensorService.getCharacteristic(Characteristic.ContactSensorState).onGet(() => this.device.isOpen);

	}
}
