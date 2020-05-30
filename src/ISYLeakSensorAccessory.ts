import './utils';

import { Categories } from 'hap-nodejs';
import { InsteonDoorWindowSensorDevice, InsteonLeakSensorDevice } from 'isy-nodejs';

import { ISYDeviceAccessory } from './ISYDeviceAccessory';
import { Characteristic, Service } from './plugin';

export class ISYLeakSensorAccessory extends ISYDeviceAccessory<InsteonLeakSensorDevice, Categories.SENSOR> {

	// Handles the identify command.
	// Translates the state of the underlying device object into the corresponding homekit compatible state
	public map(propertyName: any, propertyValue: any)  {
		if (propertyName === 'ST') {
			// tslint:disable-next-line: triple-equals
			return { characteristicValue: propertyValue == 0 ? Characteristic.LeakDetected.LEAK_DETECTED : Characteristic.LeakDetected.LEAK_NOT_DETECTED, characteristic: Characteristic.LeakDetected, service: this.primaryService };
		}
		return { characteristicValue: propertyValue, service: this.primaryService };
	}

	// Mirrors change in the state of the underlying isj-js device object.
	public handlePropertyChange(propertyName: string, value: any,  oldValue: any, formattedValue: string) {
		super.handlePropertyChange(propertyName, value, oldValue, formattedValue);

	}
	// Returns the set of services supported by this object.
	public setupServices() {
		super.setupServices();

		const sensorService = this.platformAccessory.getOrAddService(Service.LeakSensor);
		this.primaryService = sensorService;
		sensorService.getCharacteristic(Characteristic.LeakDetected).onGet(() => !this.device.leakDetected);

	}
}
