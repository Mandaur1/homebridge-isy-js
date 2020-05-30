"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ISYLeakSensorAccessory = void 0;
require("./utils");
const ISYDeviceAccessory_1 = require("./ISYDeviceAccessory");
const plugin_1 = require("./plugin");
class ISYLeakSensorAccessory extends ISYDeviceAccessory_1.ISYDeviceAccessory {
    // Handles the identify command.
    // Translates the state of the underlying device object into the corresponding homekit compatible state
    map(propertyName, propertyValue) {
        if (propertyName === 'ST') {
            // tslint:disable-next-line: triple-equals
            return { characteristicValue: propertyValue == 0 ? plugin_1.Characteristic.LeakDetected.LEAK_DETECTED : plugin_1.Characteristic.LeakDetected.LEAK_NOT_DETECTED, characteristic: plugin_1.Characteristic.LeakDetected, service: this.primaryService };
        }
        return { characteristicValue: propertyValue, service: this.primaryService };
    }
    // Mirrors change in the state of the underlying isj-js device object.
    handlePropertyChange(propertyName, value, oldValue, formattedValue) {
        super.handlePropertyChange(propertyName, value, oldValue, formattedValue);
    }
    // Returns the set of services supported by this object.
    setupServices() {
        super.setupServices();
        const sensorService = this.platformAccessory.getOrAddService(plugin_1.Service.LeakSensor);
        this.primaryService = sensorService;
        sensorService.getCharacteristic(plugin_1.Characteristic.LeakDetected).onGet(() => !this.device.leakDetected);
    }
}
exports.ISYLeakSensorAccessory = ISYLeakSensorAccessory;
//# sourceMappingURL=ISYLeakSensorAccessory.js.map