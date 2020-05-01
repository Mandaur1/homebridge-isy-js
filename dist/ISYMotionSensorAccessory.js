"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

const hap_nodejs_1 = require("/usr/local/lib/node_modules/homebridge/node_modules/hap-nodejs/dist/index.js");

const HomeKit_1 = require("/usr/local/lib/node_modules/homebridge/node_modules/hap-nodejs/dist/lib/gen/HomeKit.js");

const ISYDeviceAccessory_1 = require("./ISYDeviceAccessory");

const utils_1 = require("./utils");

class ISYMotionSensorAccessory extends ISYDeviceAccessory_1.ISYDeviceAccessory {
  get motionSensorService() {
    var _a;

    return (_a = this.platformAccessory) === null || _a === void 0 ? void 0 : _a.getOrAddService(HomeKit_1.MotionSensor);
  }

  get lightSensorService() {
    var _a;

    return (_a = this.platformAccessory) === null || _a === void 0 ? void 0 : _a.getOrAddService(HomeKit_1.LightSensor);
  }

  get batteryLevelService() {
    var _a;

    return (_a = this.platformAccessory) === null || _a === void 0 ? void 0 : _a.getOrAddService(hap_nodejs_1.Service.BatteryService);
  }

  get temperatureSensorService() {
    var _a;

    return (_a = this.platformAccessory) === null || _a === void 0 ? void 0 : _a.getOrAddService(hap_nodejs_1.Service.TemperatureSensor);
  }

  constructor(device) {
    super(device);
    this.category = 10
    /* SENSOR */
    ;
  }

  map(propertyName, propertyValue) {
    // let o = super(propertyValue,propertyValue);
    switch (propertyName) {
      case 'CLITEMP':
        return {
          characteristicValue: utils_1.toCelsius(propertyValue),
          characteristic: hap_nodejs_1.Characteristic.CurrentTemperature,
          service: this.temperatureSensorService
        };

      case 'BATLVL':
        return {
          characteristicValue: propertyValue,
          characteristic: hap_nodejs_1.Characteristic.BatteryLevel,
          service: this.batteryLevelService
        };

      case 'ST':
        return {
          characteristicValue: propertyValue,
          characteristic: hap_nodejs_1.Characteristic.Active,
          service: this.informationService
        };

      case 'LUMIN':
        return {
          characteristicValue: propertyValue,
          characteristic: hap_nodejs_1.Characteristic.CurrentTemperature,
          service: this.lightSensorService
        };

      case 'motionDetected':
        return {
          characteristicValue: propertyValue,
          characteristic: hap_nodejs_1.Characteristic.MotionDetected,
          service: this.motionSensorService
        };
    }

    return null;
  }

  handleControlTrigger(controlName) {
    super.handleControlTrigger(controlName);

    if (controlName === 'DON') {
      this.updateCharacteristicValue(true, hap_nodejs_1.Characteristic.MotionDetected, this.motionSensorService);
    } else if (controlName === 'DOF') {
      this.updateCharacteristicValue(false, hap_nodejs_1.Characteristic.MotionDetected, this.motionSensorService);
    }
  } // Handles the identify command.
  // Handles the request to get he current motion sensor state.
  // Mirrors change in the state of the underlying isj-js device object.

  /*ublic handleExternalChange(propertyName: string, value: any, formattedValue: string) {
      super.handleExternalChange(propertyName, value, formattedValue);
       this.sensorService.getCharacteristic(Characteristic.MotionDetected).updateValue(this.device.isMotionDetected);
  }
  // Returns the set of services supported by this object.
  var undefined = sensorService;
  */


  setupServices() {
    super.setupServices();
    this.primaryService = this.motionSensorService;
    this.motionSensorService.getCharacteristic(hap_nodejs_1.Characteristic.MotionDetected).onGet(() => this.device.isMotionDetected);
    this.temperatureSensorService.getCharacteristic(hap_nodejs_1.Characteristic.CurrentTemperature).onGet(() => utils_1.toCelsius(this.device.CLITEMP));
    this.batteryLevelService.getCharacteristic(hap_nodejs_1.Characteristic.BatteryLevel).onGet(() => this.device.BATLVL);
    this.lightSensorService.getCharacteristic(hap_nodejs_1.Characteristic.CurrentAmbientLightLevel).onGet(() => this.device.LUMIN);
  }

}

exports.ISYMotionSensorAccessory = ISYMotionSensorAccessory;