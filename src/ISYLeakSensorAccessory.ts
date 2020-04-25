import './utils';

import { Categories, Characteristic, Service } from 'hap-nodejs';
import { InsteonDoorWindowSensorDevice, InsteonLeakSensorDevice } from 'isy-nodejs';

import { ISYDeviceAccessory } from './ISYDeviceAccessory';
import { LeakSensor } from 'hap-nodejs/dist/lib/gen/HomeKit';





export class ISYLeakSensorAccessory extends ISYDeviceAccessory<InsteonLeakSensorDevice,Categories.SENSOR> {


	constructor (device: InsteonLeakSensorDevice) {
		super(device);
		this.doorWindowState = false;
	}
	// Handles the identify command.
	// Translates the state of the underlying device object into the corresponding homekit compatible state

	public map(propertyName, propertyValue)
	{
		const o = super.map(propertyName, propertyValue);
		o.characteristic = Characteristic.LeakDetected;
		return o;
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
		sensorService.getCharacteristic(Characteristic.LeakDetected).onGet(() => this.device.leakDetected);

	}
}
