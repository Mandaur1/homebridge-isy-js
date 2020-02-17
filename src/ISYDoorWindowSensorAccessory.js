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
var ISYDeviceAccessory_1 = require("./ISYDeviceAccessory");
require("./utils");
var hap_nodejs_1 = require("homebridge/node_modules/hap-nodejs");
var ISYDoorWindowSensorAccessory = /** @class */ (function (_super) {
    __extends(ISYDoorWindowSensorAccessory, _super);
    function ISYDoorWindowSensorAccessory(log, device) {
        var _this = _super.call(this, log, device) || this;
        _this.doorWindowState = false;
        return _this;
    }
    // Handles the identify command.
    // Translates the state of the underlying device object into the corresponding homekit compatible state
    ISYDoorWindowSensorAccessory.prototype.translateCurrentDoorWindowState = function () {
        return this.device.isOpen ? hap_nodejs_1.Characteristic.ContactSensorState.CONTACT_NOT_DETECTED : hap_nodejs_1.Characteristic.ContactSensorState.CONTACT_DETECTED;
    };
    // Handles the request to get he current door window state.
    ISYDoorWindowSensorAccessory.prototype.getCurrentDoorWindowState = function (callback) {
        callback(null, this.translateCurrentDoorWindowState());
    };
    // Mirrors change in the state of the underlying isj-js device object.
    ISYDoorWindowSensorAccessory.prototype.handleExternalChange = function (propertyName, value, formattedValue) {
        _super.prototype.handleExternalChange.call(this, propertyName, value, formattedValue);
        this.sensorService.setCharacteristic(hap_nodejs_1.Characteristic.ContactSensorState, this.translateCurrentDoorWindowState());
    };
    // Returns the set of services supported by this object.
    ISYDoorWindowSensorAccessory.prototype.getServices = function () {
        _super.prototype.getServices.call(this);
        var sensorService = this.addService(hap_nodejs_1.Service.ContactSensor);
        this.sensorService = sensorService;
        sensorService.getCharacteristic(hap_nodejs_1.Characteristic.ContactSensorState).on(hap_nodejs_1.CharacteristicEventTypes.GET, this.getCurrentDoorWindowState.bind(this));
        return [this.informationService, sensorService];
    };
    return ISYDoorWindowSensorAccessory;
}(ISYDeviceAccessory_1.ISYDeviceAccessory));
exports.ISYDoorWindowSensorAccessory = ISYDoorWindowSensorAccessory;
