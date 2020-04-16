"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

const hap_nodejs_1 = require("homebridge/node_modules/hap-nodejs");

const ISYRelayAccessory_1 = require("./ISYRelayAccessory");

require("./utils");

class InsteonDimmableAccessory extends ISYRelayAccessory_1.ISYRelayAccessory {
  constructor(device) {
    super(device);
    this.category = hap_nodejs_1.Categories.LIGHTBULB;
  } // Handles the identify command
  // Handles request to set the current powerstate from homekit. Will ignore redundant commands.


  map(propertyName) {
    const o = super.map(propertyName);

    if (o) {
      o.characteristic = hap_nodejs_1.Characteristic.Brightness;
    }

    return o;
  } // Mirrors change in the state of the underlying isj-js device object.


  handleExternalChange(propertyName, value, formattedValue) {
    super.handleExternalChange(propertyName, value, formattedValue);
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
    this.primaryService.getCharacteristic(hap_nodejs_1.Characteristic.Brightness).onSet(this.bind(this.device.updateBrightnessLevel)); // this.primaryService.getCharacteristic(Characteristic.Brightness).setProps({maxValue: this.device.OL});
  }

}

exports.InsteonDimmableAccessory = InsteonDimmableAccessory;