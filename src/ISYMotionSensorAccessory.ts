import { Categories } from 'hap-nodejs';
import { BatteryLevel, BatteryService, LightSensor, MotionSensor, TemperatureSensor } from 'hap-nodejs/dist/lib/gen/HomeKit';
import { Controls, InsteonMotionSensorDevice } from 'isy-nodejs';

import { ISYDeviceAccessory } from './ISYDeviceAccessory';
import { Characteristic, Service } from './plugin';
import { toCelsius } from './utils';

export class ISYMotionSensorAccessory extends ISYDeviceAccessory<InsteonMotionSensorDevice, Categories.SENSOR> {

	get motionSensorService(): MotionSensor {
		return this.platformAccessory?.getOrAddService(Service.MotionSensor);
	}

	get lightSensorService(): LightSensor {
		return this.platformAccessory?.getOrAddService(Service.LightSensor);
	}

	get batteryLevelService(): BatteryService {
		return this.platformAccessory?.getOrAddService(Service.BatteryService);
	}

	get temperatureSensorService(): TemperatureSensor {
		return this.platformAccessory?.getOrAddService(Service.TemperatureSensor);
	}

	public map(propertyName: string, propertyValue: any) {
		// let o = super(propertyValue,propertyValue);
		switch (propertyName) {
			case 'CLITEMP':
				return { characteristicValue: toCelsius(propertyValue), characteristic: Characteristic.CurrentTemperature, service: this.temperatureSensorService };
			case 'BATLVL':
				return { characteristicValue: propertyValue, characteristic: Characteristic.BatteryLevel, service: this.batteryLevelService };
			case 'ST':
				return { characteristicValue: propertyValue, characteristic: Characteristic.Active, service: this.informationService };
			case 'LUMIN':
				return { characteristicValue: propertyValue, characteristic: Characteristic.CurrentTemperature, service: this.lightSensorService };
			case 'motionDetected':
				return { characteristicValue: propertyValue, characteristic: Characteristic.MotionDetected, service: this.motionSensorService };
		}
		return null;

	}

	public handleControlTrigger(controlName: string) {
		super.handleControlTrigger(controlName);
		if (controlName === 'DON') {
			this.updateCharacteristicValue(true, Characteristic.MotionDetected, this.motionSensorService);
		} else if (controlName === 'DOF') {
			this.updateCharacteristicValue(false, Characteristic.MotionDetected, this.motionSensorService);
		}
	}

	public setupServices() {
		super.setupServices();
		this.primaryService = this.motionSensorService;
		this.motionSensorService.getCharacteristic(Characteristic.MotionDetected).onGet(() => this.device.isMotionDetected);
		this.temperatureSensorService.getCharacteristic(Characteristic.CurrentTemperature).onGet(() => toCelsius(this.device.CLITEMP));
		this.batteryLevelService.getCharacteristic(Characteristic.BatteryLevel).onGet(() => this.device.BATLVL);
		this.lightSensorService.getCharacteristic(Characteristic.CurrentAmbientLightLevel).onGet(() => this.device.LUMIN);

	}
}
