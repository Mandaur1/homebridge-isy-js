"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

const hap_nodejs_1 = require("/usr/local/lib/node_modules/homebridge/node_modules/hap-nodejs/dist/index.js");

const ISYDeviceAccessory_1 = require("./ISYDeviceAccessory");

class ISYSmokeSensorAccessory extends ISYDeviceAccessory_1.ISYDeviceAccessory {
  constructor(device) {
    super(device);
    this.doorWindowState = false;
  } // Handles the identify command.
  // Translates the state of the underlying device object into the corresponding homekit compatible state
  // Handles the request to get he current door window state.


  map(propertyName, propertyValue) {
    const o = super.map(propertyName, propertyValue);
    if (propertyName === 'ST') o.characteristic = hap_nodejs_1.Characteristic.SmokeDetected;
    return o;
  } // Mirrors change in the state of the underlying isj-js device object.
  // Returns the set of services supported by this object.


  setupServices() {
    super.setupServices();
    const sensorService = this.platformAccessory.getOrAddService(hap_nodejs_1.Service.SmokeSensor);
    this.primaryService = sensorService;
    sensorService.getCharacteristic(hap_nodejs_1.Characteristic.SmokeDetected).onGet(() => this.device.smokeDetected);
  }

}

exports.ISYSmokeSensorAccessory = ISYSmokeSensorAccessory;