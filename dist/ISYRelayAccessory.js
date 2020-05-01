"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

const hap_nodejs_1 = require("/usr/local/lib/node_modules/homebridge/node_modules/hap-nodejs/dist/index.js");

const isy_nodejs_1 = require("isy-nodejs");

const ISYDeviceAccessory_1 = require("./ISYDeviceAccessory");

require("./utils");

class ISYRelayAccessory extends ISYDeviceAccessory_1.ISYDeviceAccessory {
  constructor(device) {
    super(device);
    this.category = 8
    /* SWITCH */
    ;
    this.dimmable = device instanceof isy_nodejs_1.InsteonDimmableDevice;
  }

  map(propertyName, propertyValue) {
    const o = super.map(propertyName, propertyValue);

    if (propertyName === 'ST') {
      o.characteristic = hap_nodejs_1.Characteristic.On;
      o.service = this.primaryService;
      o.characteristicValue = this.device.isOn;
    }

    return o;
  } // Mirrors change in the state of the underlying isj-js device object.
  // public handleExternalChange(propertyName: string, value: any, formattedValue: string) {
  // super.handleExternalChange(propertyName, value, formattedValue);
  // l
  // this.primaryService.getCharacteristic(Characteristic.On).updateValue(this.device.isOn);
  // }
  // Returns the set of services supported by this object.


  setupServices() {
    super.setupServices();
    this.primaryService = this.platformAccessory.getOrAddService(hap_nodejs_1.Service.Switch);
    this.primaryService.getCharacteristic(hap_nodejs_1.Characteristic.On).onGet(() => this.device.isOn).onSet(this.bind(this.device.updateIsOn));
  }

}

exports.ISYRelayAccessory = ISYRelayAccessory;