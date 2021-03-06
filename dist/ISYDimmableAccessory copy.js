"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

const hap_nodejs_1 = require("/usr/local/lib/node_modules/homebridge/node_modules/hap-nodejs/dist/index.js");

require("./utils");

const ISYDimmableAccessory_1 = require("./ISYDimmableAccessory");

const HomeKit_1 = require("/usr/local/lib/node_modules/homebridge/node_modules/hap-nodejs/dist/lib/gen/HomeKit.js");

class ISYKeypadDimmerAccessory extends ISYDimmableAccessory_1.ISYDimmableAccessory {
  constructor(device) {
    super(device);
    this.category = 5
    /* LIGHTBULB */
    ; //this.category = Categories.Pro
  } // Handles the identify command
  // Handles request to set the current powerstate from homekit. Will ignore redundant commands.


  map(propertyName, propertyValue) {
    const o = super.map(propertyName, propertyValue);

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

    for (const child of this.device.children) {
      let service = this.platformAccessory.addService(new hap_nodejs_1.Service.StatelessProgrammableSwitch(child.displayName));
      child.on('ControlTriggered', controlName => {
        switch (controlName) {
          case 'DON':
            service.getCharacteristic(hap_nodejs_1.Characteristic.ProgrammableSwitchEvent).updateValue(HomeKit_1.ProgrammableSwitchEvent.SINGLE_PRESS);
            break;

          case 'DFON':
            service.getCharacteristic(hap_nodejs_1.Characteristic.ProgrammableSwitchEvent).updateValue(HomeKit_1.ProgrammableSwitchEvent.DOUBLE_PRESS);
            break;
        }
      });
    }

    this.primaryService = this.platformAccessory.getOrAddService(hap_nodejs_1.Service.Lightbulb);
    this.primaryService.getCharacteristic(hap_nodejs_1.Characteristic.On).onSet(this.bind(this.device.updateIsOn));
    this.primaryService.getCharacteristic(hap_nodejs_1.Characteristic.On).onGet(() => this.device.isOn); // lightBulbService.getCharacteristic(Characteristic.On).on('get', this.getPowerState.bind(this));
    // this.primaryService.getCharacteristic(Characteristic.Brightness).updateValue(this.device['OL']);

    this.primaryService.getCharacteristic(hap_nodejs_1.Characteristic.Brightness).onGet(() => this.device.brightnessLevel);
    this.primaryService.getCharacteristic(hap_nodejs_1.Characteristic.Brightness).onSet(this.bind(this.device.updateBrightnessLevel)).setProps({}); // this.primaryService.getCharacteristic(Characteristic.Brightness).setProps({maxValue: this.device.OL});
  }

}

exports.ISYKeypadDimmerAccessory = ISYKeypadDimmerAccessory; //# sourceMappingURL=ISYDimmableAccessory copy.js.map