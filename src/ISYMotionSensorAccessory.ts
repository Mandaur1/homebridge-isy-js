import { InsteonMotionSensorDevice } from 'isy-js';

import { Characteristic, CharacteristicEventTypes } from 'homebridge/node_modules/hap-nodejs';
import { MotionSensor } from 'homebridge/node_modules/hap-nodejs/dist/lib/gen/HomeKit';
import { ISYDeviceAccessory } from './ISYDeviceAccessory';

export class ISYMotionSensorAccessory extends ISYDeviceAccessory<InsteonMotionSensorDevice> {
	public sensorService: MotionSensor;
	constructor(log: (msg: any) => void, device: InsteonMotionSensorDevice) {
		super(log, device);
	}
	// Handles the identify command.
	// Handles the request to get he current motion sensor state.
	public getCurrentMotionSensorState(callback: (...any: any[]) => void)  {
		callback(null, this.device.isMotionDetected);
	}
	// Mirrors change in the state of the underlying isj-js device object.
	public handleExternalChange(propertyName: string, value: any, formattedValue: string) {
		super.handleExternalChange(propertyName, value, formattedValue);
		this.sensorService.setCharacteristic(Characteristic.MotionDetected, this.device.isMotionDetected);
	}
	// Returns the set of services supported by this object.
	public getServices() {
		super.getServices();
		const sensorService = this.addService(MotionSensor);
		this.sensorService = sensorService;
		sensorService.getCharacteristic(Characteristic.MotionDetected).on(CharacteristicEventTypes.GET, this.getCurrentMotionSensorState.bind(this));
		return [this.informationService, sensorService];
	}
}
