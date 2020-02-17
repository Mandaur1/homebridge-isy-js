"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var hap_nodejs_1 = require("homebridge/node_modules/hap-nodejs");
var HomeKit_1 = require("homebridge/node_modules/hap-nodejs/dist/lib/gen/HomeKit");
var ISYDeviceAccessory_1 = require("./ISYDeviceAccessory");
var ISYMotionSensorAccessory = /** @class */ (function (_super) {
    __extends(ISYMotionSensorAccessory, _super);
    function ISYMotionSensorAccessory(log, device) {
        return _super.call(this, log, device) || this;
    }
    // Handles the identify command.
    // Handles the request to get he current motion sensor state.
    ISYMotionSensorAccessory.prototype.getCurrentMotionSensorState = function (callback) {
        callback(null, this.device.isMotionDetected);
    };
    // Mirrors change in the state of the underlying isj-js device object.
    ISYMotionSensorAccessory.prototype.handleExternalChange = function (propertyName, value, formattedValue) {
        _super.prototype.handleExternalChange.call(this, propertyName, value, formattedValue);
        this.sensorService.setCharacteristic(hap_nodejs_1.Characteristic.MotionDetected, this.device.isMotionDetected);
    };
    // Returns the set of services supported by this object.
    ISYMotionSensorAccessory.prototype.getServices = function () {
        _super.prototype.getServices.call(this);
        var sensorService = this.addService(HomeKit_1.MotionSensor);
        this.sensorService = sensorService;
        sensorService.getCharacteristic(hap_nodejs_1.Characteristic.MotionDetected).on(hap_nodejs_1.CharacteristicEventTypes.GET, this.getCurrentMotionSensorState.bind(this));
        return [this.informationService, sensorService];
    };
    return ISYMotionSensorAccessory;
}(ISYDeviceAccessory_1.ISYDeviceAccessory));
exports.ISYMotionSensorAccessory = ISYMotionSensorAccessory;
