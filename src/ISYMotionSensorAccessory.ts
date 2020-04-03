import { Categories, Characteristic, CharacteristicEventTypes, Service } from 'hap-nodejs';
import { MotionSensor } from 'hap-nodejs/dist/lib/gen/HomeKit';
import { InsteonMotionSensorDevice } from 'isy-js';

import { ISYDeviceAccessory } from './ISYDeviceAccessory';

export class ISYMotionSensorAccessory extends ISYDeviceAccessory<InsteonMotionSensorDevice,Categories.SENSOR> {
	public sensorService: MotionSensor;
	constructor(device: InsteonMotionSensorDevice) {
		super(device);
	}
	// Handles the identify command.
	// Handles the request to get he current motion sensor state.
	public getCurrentMotionSensorState(callback: (...any: any[]) => void)  {
		callback(null, this.device.isMotionDetected);
	}
	// Mirrors change in the state of the underlying isj-js device object.
	public handleExternalChange(propertyName: string, value: any, formattedValue: string) {
		super.handleExternalChange(propertyName, value, formattedValue);
		this.sensorService.getCharacteristic(Characteristic.MotionDetected).updateValue(this.device.isMotionDetected);
	}
	// Returns the set of services supported by this object.
	public setupServices() {
		super.setupServices();
		const sensorService = this.platformAccessory.getOrAddService(Service.MotionSensor);
		this.sensorService = sensorService;
		sensorService.getCharacteristic(Characteristic.MotionDetected).onGet(() => this.device.isMotionDetected);
		return [this.informationService, this.sensorService];
	}
}
