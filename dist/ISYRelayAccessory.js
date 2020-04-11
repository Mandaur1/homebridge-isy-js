"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("./utils");
const hap_nodejs_1 = require("hap-nodejs");
const isy_js_1 = require("isy-js");
const ISYDeviceAccessory_1 = require("./ISYDeviceAccessory");
class ISYRelayAccessory extends ISYDeviceAccessory_1.ISYDeviceAccessory {
    constructor(device) {
        super(device);
        this.category = hap_nodejs_1.Categories.SWITCH;
        this.dimmable = device instanceof isy_js_1.InsteonDimmableDevice;
    }
    map(propertyName) {
        const o = super.map(propertyName);
        if (o)
            o.characteristic = hap_nodejs_1.Characteristic.On;
        return o;
    }
    // Mirrors change in the state of the underlying isj-js device object.
    //public handleExternalChange(propertyName: string, value: any, formattedValue: string) {
    //super.handleExternalChange(propertyName, value, formattedValue);
    //l
    //this.primaryService.getCharacteristic(Characteristic.On).updateValue(this.device.isOn);
    //}
    // Returns the set of services supported by this object.
    setupServices() {
        const s = super.setupServices();
        this.primaryService = this.platformAccessory.getOrAddService(hap_nodejs_1.Service.Switch);
        this.primaryService.getCharacteristic(hap_nodejs_1.Characteristic.On).onGet(() => this.device.isOn).onSet(this.bind(this.device.updateIsOn));
        s.push(this.primaryService);
        return s;
    }
}
exports.ISYRelayAccessory = ISYRelayAccessory;
