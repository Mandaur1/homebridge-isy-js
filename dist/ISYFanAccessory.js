"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

require("./ISYPlatform");

const hap_nodejs_1 = require("homebridge/node_modules/hap-nodejs");

const ISYDeviceAccessory_1 = require("./ISYDeviceAccessory");

class ISYFanAccessory extends ISYDeviceAccessory_1.ISYDeviceAccessory {
  constructor(device) {
    super(device);
    this.category = hap_nodejs_1.Categories.FAN;
    device.propertyChanged.removeListener(null, super.handleExternalChange);
    this.device.Motor.onPropertyChanged(null, this.handleExternalChangeToMotor.bind(this));
    this.device.Light.onPropertyChanged(null, this.handleExternalChangeToLight.bind(this)); // this.logger(JSON.stringify(this.device.scenes[0]));
  } // Translates the fan level from homebridge into the isy-nodejs level. Maps from the 0-100
  // to the four isy-nodejs fan speed levels.
  // Handles a request to get the current brightness level for dimmable lights.


  getBrightness(callback) {
    callback(null, this.device.brightnessLevel);
  } // Mirrors change in the state of the underlying isj-js device object.


  handleExternalChangeToMotor(propertyName, value, formattedValue) {
    //super.handleExternalChange(propertyName, value, formattedValue);
    this.fanService.getCharacteristic(hap_nodejs_1.Characteristic.On).updateValue(this.device.isOn);
    this.fanService.getCharacteristic(hap_nodejs_1.Characteristic.RotationSpeed).updateValue(this.device.fanSpeed);
  }

  handleExternalChangeToLight(propertyName, value, formattedValue) {
    //super.handleExternalChange(propertyName, value, formattedValue);
    this.lightService.getCharacteristic(hap_nodejs_1.Characteristic.On).updateValue(this.device.Light.isOn);

    if (this.dimmable) {
      this.lightService.getCharacteristic(hap_nodejs_1.Characteristic.Brightness).updateValue(this.device.Light.level);
    }
  } // Returns the services supported by the fan device.


  setupServices() {
    super.setupServices();
    const fanService = this.platformAccessory.getOrAddService(hap_nodejs_1.Service.Fan);
    this.fanService = fanService;
    const lightService = this.platformAccessory.getOrAddService(hap_nodejs_1.Service.Lightbulb);
    this.lightService = lightService;
    fanService.getCharacteristic(hap_nodejs_1.Characteristic.RotationSpeed).onSet(this.device.Motor.updateFanSpeed.bind(this.device.Motor)).onGet(() => this.device.Motor.fanSpeed);
    fanService.getCharacteristic(hap_nodejs_1.Characteristic.On).onSet(this.device.Motor.updateIsOn.bind(this.device.Motor)).onGet(() => this.device.Motor.isOn);
    lightService.getCharacteristic(hap_nodejs_1.Characteristic.On).onSet(this.device.Light.updateIsOn.bind(this.device.Light)).onGet(() => this.device.Light.isOn);
    lightService.getCharacteristic(hap_nodejs_1.Characteristic.Brightness).onSet(this.device.Light.updateBrightnessLevel.bind(this.device.Light)).onGet(() => this.device.Light.brightnessLevel);
    fanService.isPrimaryService = true;
    this.primaryService = fanService;
  }

}

exports.ISYFanAccessory = ISYFanAccessory;