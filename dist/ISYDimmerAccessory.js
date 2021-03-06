"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

const hap_nodejs_1 = require("homebridge/node_modules/hap-nodejs");

const ISYRelayAccessory_1 = require("./ISYRelayAccessory");

require("./utils");

class ISYDimmableAccessory extends ISYRelayAccessory_1.ISYRelayAccessory {
  constructor(device) {
    super(device);
    this.category = 5
    /* LIGHTBULB */
    ;
  } // Handles the identify command
  // Handles request to set the current powerstate from homekit. Will ignore redundant commands.


  map(propertyName, propertyValue) {
    const o = super.map(propertyName, propertyValue);

    if (o && propertyName === 'ST') {
      o.characteristic = hap_nodejs_1.Characteristic.Brightness;
      o.characteristicValue = propertyValue;
    }

    return o;
  } // Mirrors change in the state of the underlying isj-js device object.


  handlePropertyChange(propertyName, value, oldValue, formattedValue) {
    super.handlePropertyChange(propertyName, value, oldValue, formattedValue);
    this.primaryService.getCharacteristic(hap_nodejs_1.Characteristic.On).updateValue(this.device.isOn); // this.a
    // this.primaryService.getCharacteristic(ch.name).updateValue(this.device[propertyName]);
  } // Handles request to get the current on state
  // Handles request to get the current on state
  // Handles a request to get the current brightness level for dimmable lights.


  getBrightness(callback) {
    callback(null, this.device.level);
  } // Returns the set of services supported by this object.


  setupServices() {
    const s = super.setupServices();
    this.platformAccessory.removeService(this.primaryService);
    this.primaryService = this.platformAccessory.getOrAddService(hap_nodejs_1.Service.Lightbulb);
    this.primaryService.getCharacteristic(hap_nodejs_1.Characteristic.On).onSet(this.bind(this.device.updateIsOn));
    this.primaryService.getCharacteristic(hap_nodejs_1.Characteristic.On).onGet(() => this.device.isOn); // lightBulbService.getCharacteristic(Characteristic.On).on('get', this.getPowerState.bind(this));
    // this.primaryService.getCharacteristic(Characteristic.Brightness).updateValue(this.device['OL']);

    this.primaryService.getCharacteristic(hap_nodejs_1.Characteristic.Brightness).onGet(() => this.device.brightnessLevel);
    this.primaryService.getCharacteristic(hap_nodejs_1.Characteristic.Brightness).onSet(this.bind(this.device.updateBrightnessLevel)).updateValue(this.device.OL); // this.primaryService.getCharacteristic(Characteristic.Brightness).setProps({maxValue: this.device.OL});
  }

}

exports.ISYDimmableAccessory = ISYDimmableAccessory;