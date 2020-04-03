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
require("./utils");
var hap_nodejs_1 = require("hap-nodejs");
var ISYDeviceAccessory_1 = require("./ISYDeviceAccessory");
var ISYDoorWindowSensorAccessory = /** @class */ (function (_super) {
    __extends(ISYDoorWindowSensorAccessory, _super);
    function ISYDoorWindowSensorAccessory(device) {
        var _this = _super.call(this, device) || this;
        _this.doorWindowState = false;
        return _this;
    }
    // Handles the identify command.
    // Translates the state of the underlying device object into the corresponding homekit compatible state
    ISYDoorWindowSensorAccessory.prototype.translateCurrentDoorWindowState = function () {
        return this.device.isOpen;
    };
    // Handles the request to get he current door window state.
    ISYDoorWindowSensorAccessory.prototype.getCurrentDoorWindowState = function (callback) {
        callback(null, this.translateCurrentDoorWindowState());
    };
    // Mirrors change in the state of the underlying isj-js device object.
    ISYDoorWindowSensorAccessory.prototype.handleExternalChange = function (propertyName, value, formattedValue) {
        _super.prototype.handleExternalChange.call(this, propertyName, value, formattedValue);
        this.sensorService.getCharacteristic(hap_nodejs_1.Characteristic.CurrentDoorState).updateValue(!this.device.isOpen);
    };
    // Returns the set of services supported by this object.
    ISYDoorWindowSensorAccessory.prototype.setupServices = function () {
        var _this = this;
        _super.prototype.setupServices.call(this);
        var sensorService = this.platformAccessory.getOrAddService(hap_nodejs_1.Service.ContactSensor);
        this.sensorService = sensorService;
        sensorService.getCharacteristic(hap_nodejs_1.Characteristic.ContactSensorState).onGet(function () { return _this.device.isOpen; });
        return [this.informationService, sensorService];
    };
    return ISYDoorWindowSensorAccessory;
}(ISYDeviceAccessory_1.ISYDeviceAccessory));
exports.ISYDoorWindowSensorAccessory = ISYDoorWindowSensorAccessory;
