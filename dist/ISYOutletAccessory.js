"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

require("./utils");

const hap_nodejs_1 = require("homebridge/node_modules/hap-nodejs");

const ISYDeviceAccessory_1 = require("./ISYDeviceAccessory");

class ISYOnOffOutletAccessory extends ISYDeviceAccessory_1.ISYDeviceAccessory {
  constructor(device) {
    super(device);
    this.category = 7
    /* OUTLET */
    ;
  }

  get outlet1Service() {
    var _a;

    if (!this.primaryService) {
      this.primaryService = (_a = this.platformAccessory) === null || _a === void 0 ? void 0 : _a.getOrAddService(hap_nodejs_1.Service.Outlet);
    }

    return this.primaryService;
  }

  get outlet2Service() {
    if (!this._outlet2Service) this._outlet2Service = this.platformAccessory.addService(new hap_nodejs_1.Service.Outlet('Outlet 2', '2'));
    return this._outlet2Service;
  }

  setupServices() {
    super.setupServices();
    this.outlet1Service.getCharacteristic(hap_nodejs_1.Characteristic.On).onSet(this.device.outlet1.updateIsOn.bind(this.device.outlet1));
    this.outlet1Service.getCharacteristic(hap_nodejs_1.Characteristic.On).onGet(() => this.outlet1.isOn);
    this.outlet1Service.getCharacteristic(hap_nodejs_1.Characteristic.OutletInUse).onGet(() => true);
    this.outlet2Service.getCharacteristic(hap_nodejs_1.Characteristic.On).onSet(this.device.outlet2.updateIsOn.bind(this.device.outlet2));
    this.outlet2Service.getCharacteristic(hap_nodejs_1.Characteristic.On).onGet(() => this.outlet2.isOn);
    this.outlet2Service.getCharacteristic(hap_nodejs_1.Characteristic.OutletInUse).onGet(() => true);
  }

}

exports.ISYOnOffOutletAccessory = ISYOnOffOutletAccessory;

class ISYOutletAccessory extends ISYDeviceAccessory_1.ISYDeviceAccessory {
  constructor(device) {
    super(device);
    this.category = 7
    /* OUTLET */
    ;
  } // Handles the identify command
  // Handles a request to set the outlet state. Ignores redundant sets based on current states.


  setOutletState(outletState, callback) {
    this.log.info(`OUTLET: Sending command to set outlet state to: ${outletState}`);

    if (outletState !== this.device.isOn) {
      this.device.updateIsOn(outletState).then(callback(true)).catch(callback(false));
    } else {
      callback();
    }
  } // Handles a request to get the current outlet state based on underlying isy-nodejs device object.


  getOutletState(callback) {
    callback(null, this.device.isOn);
  } // Handles a request to get the current in use state of the outlet. We set this to true always as
  // there is no way to deterine this through the isy.


  getOutletInUseState(callback) {
    callback(null, true);
  } // Mirrors change in the state of the underlying isj-js device object.


  handleExternalChange(propertyName, value, oldValue, formattedValue) {
    super.handleExternalChange(propertyName, value, oldValue, formattedValue);
    this.outletService.updateCharacteristic(hap_nodejs_1.Characteristic.On, this.device.isOn);
  } // Returns the set of services supported by this object.


  setupServices() {
    super.setupServices();
    const outletService = this.platformAccessory.getOrAddService(hap_nodejs_1.Service.Outlet);
    this.primaryService = outletService;
    outletService.getCharacteristic(hap_nodejs_1.Characteristic.On).onSet(this.bind(this.device.updateIsOn));
    outletService.getCharacteristic(hap_nodejs_1.Characteristic.On).onGet(() => this.device.isOn);
    outletService.getCharacteristic(hap_nodejs_1.Characteristic.OutletInUse).onGet(() => true);
  }

}

exports.ISYOutletAccessory = ISYOutletAccessory;