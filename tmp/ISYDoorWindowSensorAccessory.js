"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("./utils");
const hap_nodejs_1 = require("hap-nodejs");
const ISYDeviceAccessory_1 = require("./ISYDeviceAccessory");
class ISYDoorWindowSensorAccessory extends ISYDeviceAccessory_1.ISYDeviceAccessory {
    constructor(device) {
        super(device);
        this.doorWindowState = false;
    }
    // Handles the identify command.
    // Translates the state of the underlying device object into the corresponding homekit compatible state
    // Handles the request to get he current door window state.
    map(propertyName, propertyValue) {
        const o = super.map(propertyName, propertyValue);
        if (propertyName === 'ST')
            o.characteristic = hap_nodejs_1.Characteristic.ContactSensorState;
        return o;
    }
    // Mirrors change in the state of the underlying isj-js device object.
    // Returns the set of services supported by this object.
    setupServices() {
        super.setupServices();
        const sensorService = this.platformAccessory.getOrAddService(hap_nodejs_1.Service.ContactSensor);
        this.primaryService = sensorService;
        sensorService.getCharacteristic(hap_nodejs_1.Characteristic.ContactSensorState).onGet(() => this.device.isOpen);
    }
}
exports.ISYDoorWindowSensorAccessory = ISYDoorWindowSensorAccessory;
//# sourceMappingURL=ISYDoorWindowSensorAccessory.js.map