"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ISYDeviceAccessory_1 = require("./ISYDeviceAccessory");
const plugin_1 = require("./plugin");
class ISYMotionSensorAccessory extends ISYDeviceAccessory_1.ISYDeviceAccessory {
    constructor(log, device) {
        super(log, device);
    }
    // Handles the identify command.
    // Handles the request to get he current motion sensor state.
    getCurrentMotionSensorState(callback) {
        callback(null, this.device.isMotionDetected);
    }
    // Mirrors change in the state of the underlying isj-js device object.
    handleExternalChange(propertyName, value, formattedValue) {
        super.handleExternalChange(propertyName, value, formattedValue);
        this.sensorService.setCharacteristic(plugin_1.Characteristic.MotionDetected, this.device.isMotionDetected);
    }
    // Returns the set of services supported by this object.
    getServices() {
        super.getServices();
        const sensorService = new plugin_1.Service.MotionSensor();
        this.sensorService = sensorService;
        sensorService.getCharacteristic(plugin_1.Characteristic.MotionDetected).on('get', this.getCurrentMotionSensorState.bind(this));
        return [this.informationService, sensorService];
    }
}
exports.ISYMotionSensorAccessory = ISYMotionSensorAccessory;
