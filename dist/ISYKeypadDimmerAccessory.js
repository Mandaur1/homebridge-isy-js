"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

const hap_nodejs_1 = require("/usr/local/lib/node_modules/homebridge/node_modules/hap-nodejs/dist/index.js");

require("./utils");

const ISYDimmableAccessory_1 = require("./ISYDimmableAccessory");

const HomeKit_1 = require("/usr/local/lib/node_modules/homebridge/node_modules/hap-nodejs/dist/lib/gen/HomeKit.js");

const uuid_1 = require("/usr/local/lib/node_modules/homebridge/node_modules/hap-nodejs/dist/lib/util/uuid.js");

class ISYKeypadDimmerAccessory extends ISYDimmableAccessory_1.ISYDimmableAccessory {
  constructor(device) {
    super(device);
    this.UUID = uuid_1.generate(`${device.isy.address}:${device.address}0`);
    this.category = 5
    /* LIGHTBULB */
    ;
    this.displayName = super.displayName + ' (Buttons)'; //this.category = Categories.Pro
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
    var _a;

    const s = super.setupServices(); //this.platformAccessory.removeService(this.primaryService);

    for (const child of this.device.children) {
      let serv = this.platformAccessory.getServiceByUUIDAndSubType(hap_nodejs_1.Service.StatelessProgrammableSwitch, child.name);
      const service = serv !== null && serv !== void 0 ? serv : this.platformAccessory.addService(new hap_nodejs_1.Service.StatelessProgrammableSwitch(child.displayName, child.name));
      const self = this;
      child.on('ControlTriggered', controlName => {
        switch (controlName) {
          case 'DON':
            self.logger('DON recieved. Mapping to SINGLE_PRESS.');
            service.getCharacteristic(hap_nodejs_1.Characteristic.ProgrammableSwitchEvent).updateValue(HomeKit_1.ProgrammableSwitchEvent.SINGLE_PRESS);
            break;

          case 'DFON':
            self.logger('DON recieved. Mapping to DOUBLE_PRESS.');
            service.getCharacteristic(hap_nodejs_1.Characteristic.ProgrammableSwitchEvent).updateValue(HomeKit_1.ProgrammableSwitchEvent.DOUBLE_PRESS);
            break;

          case 'BRT':
            service.getCharacteristic(hap_nodejs_1.Characteristic.ProgrammableSwitchEvent).updateValue(HomeKit_1.ProgrammableSwitchEvent.LONG_PRESS);
            break;
        }
      });
    }

    const s1 = (_a = this.platformAccessory.getServiceByUUIDAndSubType(hap_nodejs_1.Service.StatelessProgrammableSwitch, this.device.name), _a !== null && _a !== void 0 ? _a : this.platformAccessory.addService(new hap_nodejs_1.Service.StatelessProgrammableSwitch(this.device.displayName + " (Button)", this.device.name)));
    this.device.on('ControlTriggered', controlName => {
      switch (controlName) {
        case 'DON':
          s1.getCharacteristic(hap_nodejs_1.Characteristic.ProgrammableSwitchEvent).updateValue(HomeKit_1.ProgrammableSwitchEvent.SINGLE_PRESS);
          break;

        case 'DFON':
          s1.getCharacteristic(hap_nodejs_1.Characteristic.ProgrammableSwitchEvent).updateValue(HomeKit_1.ProgrammableSwitchEvent.DOUBLE_PRESS);
          break;

        case 'BRT':
          s1.getCharacteristic(hap_nodejs_1.Characteristic.ProgrammableSwitchEvent).updateValue(HomeKit_1.ProgrammableSwitchEvent.LONG_PRESS);
          break;
      }
    }); //this.primaryService = this.platformAccessory.getOrAddService(Service.Lightbulb);
    //this.primaryService.getCharacteristic(Characteristic.On).onSet(this.bind(this.device.updateIsOn));
    //this.primaryService.getCharacteristic(Characteristic.On).onGet(() => this.device.isOn);
    // lightBulbService.getCharacteristic(Characteristic.On).on('get', this.getPowerState.bind(this));
    // this.primaryService.getCharacteristic(Characteristic.Brightness).updateValue(this.device['OL']);
    //this.primaryService.getCharacteristic(Characteristic.Brightness).onGet(() => this.device.brightnessLevel);
    //this.primaryService.getCharacteristic(Characteristic.Brightness).onSet(this.bind(this.device.updateBrightnessLevel)).setProps(
    //{}
    //);

    this.platformAccessory.category = 5
    /* LIGHTBULB */
    ;
    this.primaryService.setPrimaryService(true);

    this.platformAccessory._associatedHAPAccessory.setPrimaryService(this.primaryService); // this.primaryService.getCharacteristic(Characteristic.Brightness).setProps({maxValue: this.devi;ce.OL});

  }

}

exports.ISYKeypadDimmerAccessory = ISYKeypadDimmerAccessory;