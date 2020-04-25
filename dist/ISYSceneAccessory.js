"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

require("./utils");

const hap_nodejs_1 = require("homebridge/node_modules/hap-nodejs");

const ISYAccessory_1 = require("./ISYAccessory");

const utils_1 = require("./utils");

class ISYSceneAccessory extends ISYAccessory_1.ISYAccessory {
  constructor(scene) {
    super(scene);
    this.category = 5
    /* LIGHTBULB */
    ;
    this.scene = scene;
    this.dimmable = scene.isDimmable; // this.logger = function(msg) {log("Scene Accessory: " + scene.name + ": " + msg); };
  } // Handles the identify command


  identify() {
    const that = this;
  } // Handles request to set the current powerstate from homekit. Will ignore redundant commands.
  // Mirrors change in the state of the underlying isj-js device object.


  handlePropertyChange(propertyName, value, oldValue, formattedValue) {
    this.primaryService.getCharacteristic(hap_nodejs_1.Characteristic.On).updateValue(this.scene.isOn);

    if (this.dimmable) {
      this.primaryService.getCharacteristic(hap_nodejs_1.Characteristic.Brightness).updateValue(this.scene.brightnessLevel);
    }
  } // Handles request to get the current on state


  getPowerState(callback) {
    callback(null, this.scene.isOn);
  } // Returns the set of services supported by this object.


  setupServices() {
    super.setupServices();

    if (this.dimmable) {
      this.primaryService = this.platformAccessory.getOrAddService(hap_nodejs_1.Service.Lightbulb);
      utils_1.onSet(this.primaryService.getCharacteristic(hap_nodejs_1.Characteristic.Brightness), this.bind(this.device.updateBrightnessLevel)).onGet(() => this.device.brightnessLevel);
    } else {
      this.primaryService = this.platformAccessory.getOrAddService(hap_nodejs_1.Service.Switch);
    }

    this.primaryService.getCharacteristic(hap_nodejs_1.Characteristic.On).onGet(() => this.device.isOn).onSet(this.bind(this.device.updateIsOn));
  }

}

exports.ISYSceneAccessory = ISYSceneAccessory;