"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

require("./utils");

const hap_nodejs_1 = require("homebridge/node_modules/hap-nodejs");

const ISYDeviceAccessory_1 = require("./ISYDeviceAccessory");

class ISYLeakSensorAccessory extends ISYDeviceAccessory_1.ISYDeviceAccessory {
  constructor(device) {
    super(device);
    this.doorWindowState = false;
  } // Handles the identify command.
  // Translates the state of the underlying device object into the corresponding homekit compatible state
  // Mirrors change in the state of the underlying isj-js device object.


  handleExternalChange(propertyName, value, oldValue, formattedValue) {
    super.handleExternalChange(propertyName, value, oldValue, formattedValue);
    this.primaryService.getCharacteristic(hap_nodejs_1.Characteristic.CurrentDoorState).updateValue(!this.device.leakDetected ? 1 : 0);
  } // Returns the set of services supported by this object.


  setupServices() {
    super.setupServices();
    const sensorService = this.platformAccessory.getOrAddService(hap_nodejs_1.Service.ContactSensor);
    this.primaryService = sensorService;
    sensorService.getCharacteristic(hap_nodejs_1.Characteristic.ContactSensorState).onGet(() => this.device.leakDetected);
  }

}

exports.ISYLeakSensorAccessory = ISYLeakSensorAccessory;