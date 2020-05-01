"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

require("./utils");

const hap_nodejs_1 = require("/usr/local/lib/node_modules/homebridge/node_modules/hap-nodejs/dist/index.js");

const ISYDeviceAccessory_1 = require("./ISYDeviceAccessory");

class ISYLeakSensorAccessory extends ISYDeviceAccessory_1.ISYDeviceAccessory {
  constructor(device) {
    super(device);
    this.doorWindowState = false;
  } // Handles the identify command.
  // Translates the state of the underlying device object into the corresponding homekit compatible state


  map(propertyName, propertyValue) {
    const o = super.map(propertyName, propertyValue);
    o.characteristic = hap_nodejs_1.Characteristic.LeakDetected;
    return o;
  } // Mirrors change in the state of the underlying isj-js device object.


  handlePropertyChange(propertyName, value, oldValue, formattedValue) {
    super.handlePropertyChange(propertyName, value, oldValue, formattedValue);
  } // Returns the set of services supported by this object.


  setupServices() {
    super.setupServices();
    const sensorService = this.platformAccessory.getOrAddService(hap_nodejs_1.Service.LeakSensor);
    this.primaryService = sensorService;
    sensorService.getCharacteristic(hap_nodejs_1.Characteristic.LeakDetected).onGet(() => this.device.leakDetected);
  }

}

exports.ISYLeakSensorAccessory = ISYLeakSensorAccessory;