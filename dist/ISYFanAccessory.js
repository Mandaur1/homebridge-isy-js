"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

require("./ISYPlatform");

const hap_nodejs_1 = require("/usr/local/lib/node_modules/homebridge/node_modules/hap-nodejs/dist/index.js");

const ISYDeviceAccessory_1 = require("./ISYDeviceAccessory");

class ISYFanAccessory extends ISYDeviceAccessory_1.ISYDeviceAccessory {
  constructor(device) {
    super(device);
    this.category = 3
    /* FAN */
    ; // device.propertyChanged.removeListener(null, super.handleExternalChange);
    // this.device.Motor.onPropertyChanged(null, this.handleExternalChangeToMotor.bind(this));
    // this.device.Light.onPropertyChanged(null, this.handleExternalChangeToLight.bind(this));
    // this.logger(JSON.stringify(this.device.scenes[0]));
  } // Translates the fan level from homebridge into the isy-nodejs level. Maps from the 0-100
  // to the four isy-nodejs fan speed levels.


  map(propertyName, propertyValue) {
    //super.map(propertyName,propertyValue);
    if (propertyName === 'motor.ST') {
      return {
        characteristicValue: propertyValue,
        characteristic: hap_nodejs_1.Characteristic.RotationSpeed,
        service: this.fanService
      };
    } else if (propertyName === 'light.ST') {
      return {
        characteristicValue: propertyValue,
        characteristic: hap_nodejs_1.Characteristic.Brightness,
        service: this.lightService
      };
    }
  } // Handles a request to get the current brightness level for dimmable lights.


  handlePropertyChange(propertyName, value, oldValue, formattedValue) {
    super.handlePropertyChange(propertyName, value, oldValue, formattedValue);
    this.fanService.getCharacteristic(hap_nodejs_1.Characteristic.On).updateValue(this.device.motor.isOn);
    this.lightService.getCharacteristic(hap_nodejs_1.Characteristic.On).updateValue(this.device.light.isOn); //this.fanService.getCharacteristic(Characteristic.RotationSpeed).updateValue(this.device.motor.fanSpeed);
  } // Mirrors change in the state of the underlying isj-js device object.
  // Returns the services supported by the fan device.


  setupServices() {
    super.setupServices(); //this.platformAccessory.removeService(this.primaryService);

    const fanService = this.platformAccessory.getOrAddService(hap_nodejs_1.Service.Fan);
    this.fanService = fanService;
    const lightService = this.platformAccessory.getOrAddService(hap_nodejs_1.Service.Lightbulb);
    this.lightService = lightService;
    fanService.getCharacteristic(hap_nodejs_1.Characteristic.RotationSpeed).onSet(this.device.motor.updateFanSpeed.bind(this.device.motor)).onGet((() => this.device.motor.fanSpeed).bind(this)).setProps({
      minStep: 25
    });
    fanService.getCharacteristic(hap_nodejs_1.Characteristic.On).onSet(this.device.motor.updateIsOn.bind(this.device.motor)).onGet((() => this.device.motor.isOn).bind(this));
    lightService.getCharacteristic(hap_nodejs_1.Characteristic.On).onSet(this.device.light.updateIsOn.bind(this.device.light)).onGet((() => this.device.light.isOn).bind(this));
    lightService.getCharacteristic(hap_nodejs_1.Characteristic.Brightness).onSet(this.device.light.updateBrightnessLevel.bind(this.device.light)).onGet((() => this.device.light.brightnessLevel).bind(this));
    fanService.isPrimaryService = true;
    this.primaryService = fanService;
  }

}

exports.ISYFanAccessory = ISYFanAccessory;