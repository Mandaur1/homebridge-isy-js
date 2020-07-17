import './utils';

import { Categories } from 'hap-nodejs';
import { InsteonDoorWindowSensorDevice } from 'isy-nodejs';

import { ISYDeviceAccessory } from './ISYDeviceAccessory';
import { Characteristic, Service } from './plugin';

export class ISYDoorWindowSensorAccessory extends ISYDeviceAccessory<InsteonDoorWindowSensorDevice, Categories.SENSOR> {

	// Handles the identify command.
	// Translates the state of the underlying device object into the corresponding homekit compatible state

	// Handles the request to get he current door window state.
	public map(propertyName: string, propertyValue: any) {
		const o = super.map(propertyName, propertyValue);
		if (propertyName === 'ST') {
			o.characteristic = Characteristic.ContactSensorState;
		}
		return o;
	}

	// Mirrors change in the state of the underlying isj-js device object.

	// Returns the set of services supported by this object.
	public setupServices() {
		super.setupServices();

		const sensorService = this.platformAccessory.getOrAddService(Service.ContactSensor);
		this.primaryService = sensorService;
		sensorService.getCharacteristic(Characteristic.ContactSensorState).onGet(() => this.device.isOpen);

	}
}
