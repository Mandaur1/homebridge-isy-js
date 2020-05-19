
import { Categories } from 'hap-nodejs';
import { InsteonSmokeSensorDevice } from 'isy-nodejs';
import { ISYDeviceAccessory } from './ISYDeviceAccessory';
import { Characteristic, Service } from './plugin';
export class ISYSmokeSensorAccessory extends ISYDeviceAccessory<InsteonSmokeSensorDevice, Categories.SENSOR> {
	constructor(device: InsteonSmokeSensorDevice, platform) {
		super(device, platform);
		this.doorWindowState = false;
	}
	// Handles the identify command.
	// Translates the state of the underlying device object into the corresponding homekit compatible state
	// Handles the request to get he current door window state.
	public map(propertyName, propertyValue) {
		const o = super.map(propertyName, propertyValue);
		if (propertyName === 'ST') {
			o.characteristic = Characteristic.SmokeDetected;
		}
		return o;
	}
	// Mirrors change in the state of the underlying isj-js device object.
	// Returns the set of services supported by this object.
	public setupServices() {
		super.setupServices();
		const sensorService = this.platformAccessory.getOrAddService(Service.SmokeSensor);
		this.primaryService = sensorService;
		sensorService.getCharacteristic(Characteristic.SmokeDetected).onGet(() => this.device.smokeDetected);
	}
}
