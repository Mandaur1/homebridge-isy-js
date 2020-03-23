
import { InsteonDoorWindowSensorDevice } from 'isy-js';

import { ISYDeviceAccessory } from './ISYDeviceAccessory';
import './utils';
import { Characteristic, Service, CharacteristicEventTypes } from 'hap-nodejs'

export class ISYDoorWindowSensorAccessory extends ISYDeviceAccessory<InsteonDoorWindowSensorDevice> {

	public sensorService: Service;
	constructor(log: (msg: any) => void, device: InsteonDoorWindowSensorDevice) {
		super(log, device);
		this.doorWindowState = false;
	}
	// Handles the identify command.
	// Translates the state of the underlying device object into the corresponding homekit compatible state
	public translateCurrentDoorWindowState()  {
	
		return this.device.isOpen ? Characteristic.CurrentDoorState.OPEN : Characteristic.CurrentDoorState.CLOSED;
	}
	// Handles the request to get he current door window state.
	public getCurrentDoorWindowState(callback) {
		callback(null, this.translateCurrentDoorWindowState());
	}
	// Mirrors change in the state of the underlying isj-js device object.
	public handleExternalChange(propertyName: string, value: any, formattedValue: string) {
		super.handleExternalChange(propertyName, value, formattedValue);
		this.sensorService.getCharacteristic(Characteristic.CurrentDoorState).updateValue(this.translateCurrentDoorWindowState());
	}
	// Returns the set of services supported by this object.
	public getServices() {
		super.getServices();
		const sensorService = this.addService(Service.Door)
		this.sensorService = sensorService;
		sensorService.getCharacteristic(Characteristic.CurrentDoorState).on(CharacteristicEventTypes.GET, this.getCurrentDoorWindowState.bind(this));
		return [this.informationService, sensorService];
	}
}
