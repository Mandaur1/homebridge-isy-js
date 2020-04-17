import { Categories, Characteristic, CharacteristicEventTypes, Service } from 'hap-nodejs';
import { BatteryLevel, BatteryService, LightSensor, MotionSensor, TemperatureSensor } from 'hap-nodejs/dist/lib/gen/HomeKit';
import { Controls, InsteonMotionSensorDevice } from 'isy-nodejs';

import { ISYDeviceAccessory } from './ISYDeviceAccessory';
import { toCelsius } from './utils';


export class ISYMotionSensorAccessory extends ISYDeviceAccessory<InsteonMotionSensorDevice, Categories.SENSOR> {


	get motionSensorService(): MotionSensor {
		return this.platformAccessory?.getOrAddService(MotionSensor);
	}

	get lightSensorService(): LightSensor {
		return this.platformAccessory?.getOrAddService(LightSensor);
	}

	get batteryLevelService(): BatteryService {
		return this.platformAccessory?.getOrAddService(Service.BatteryService);
	}

	get temperatureSensorService(): TemperatureSensor {
		return this.platformAccessory?.getOrAddService(Service.TemperatureSensor);
	}

	constructor (device: InsteonMotionSensorDevice) {
		super(device);

		this.category = Categories.SENSOR;
	}

	public map(propertyName: string): { characteristic: typeof Characteristic, service: Service; } {
		switch (propertyName) {
			case 'CLITEMP':
				return { characteristic: Characteristic.CurrentTemperature, service: this.temperatureSensorService };
			case 'BATLVL':
				return { characteristic: Characteristic.BatteryLevel, service: this.batteryLevelService };
			case 'ST':
				return { characteristic: Characteristic.Active, service: this.informationService };
			case 'LUMIN':
				return { characteristic: Characteristic.CurrentTemperature, service: this.lightSensorService };
			case 'motionDetected':
				return { characteristic: Characteristic.MotionDetected, service: this.motionSensorService };
		}
		return null;

	}
	// Handles the identify command.
	// Handles the request to get he current motion sensor state.
	public getCurrentMotionSensorState(callback: (...any: any[]) => void) {
		callback(null, this.device.isMotionDetected);
	}
	// Mirrors change in the state of the underlying isj-js device object.
	/*ublic handleExternalChange(propertyName: string, value: any, formattedValue: string) {
		super.handleExternalChange(propertyName, value, formattedValue);

		this.sensorService.getCharacteristic(Characteristic.MotionDetected).updateValue(this.device.isMotionDetected);
	}
	// Returns the set of services supported by this object.
	var undefined = sensorService;
*/
	public setupServices() {
		super.setupServices();
		this.primaryService = this.motionSensorService;
		this.motionSensorService.getCharacteristic(Characteristic.MotionDetected).onGet(() => this.device.isMotionDetected);
		this.temperatureSensorService.getCharacteristic(Characteristic.CurrentTemperature).onGet(() => toCelsius(this.device.CLITEMP));
		this.batteryLevelService.getCharacteristic(Characteristic.BatteryLevel).onGet(() => this.device.BATLVL);
		this.lightSensorService.getCharacteristic(Characteristic.CurrentAmbientLightLevel).onGet(() => this.device.LUMIN);

	}
}
