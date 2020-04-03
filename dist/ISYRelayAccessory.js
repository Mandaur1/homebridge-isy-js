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
var isy_js_1 = require("isy-js");
var ISYDeviceAccessory_1 = require("./ISYDeviceAccessory");
var ISYRelayAccessory = /** @class */ (function (_super) {
    __extends(ISYRelayAccessory, _super);
    function ISYRelayAccessory(device) {
        var _this = _super.call(this, device) || this;
        _this.dimmable = device instanceof isy_js_1.InsteonDimmableDevice;
        return _this;
    }
    // Handles the identify command
    // Handles request to set the current powerstate from homekit. Will ignore redundant commands.
    ISYRelayAccessory.prototype.setPowerState = function (powerOn, callback) {
        if (powerOn !== this.device.isOn) {
            this.device
                .updateIsOn(powerOn).handleWith(callback);
        }
        else {
            this.logger("Ignoring redundant setPowerState");
            callback();
        }
    };
    // Mirrors change in the state of the underlying isj-js device object.
    ISYRelayAccessory.prototype.handleExternalChange = function (propertyName, value, formattedValue) {
        _super.prototype.handleExternalChange.call(this, propertyName, value, formattedValue);
        this.primaryService.getCharacteristic(hap_nodejs_1.Characteristic.On).updateValue(this.device.isOn);
    };
    // Handles request to get the current on state
    // Handles request to get the current on state
    ISYRelayAccessory.prototype.getPowerState = function (callback) {
        callback(null, this.device.isOn);
    };
    // Handles request to set the brightness level of dimmable lights. Ignore redundant commands.
    ISYRelayAccessory.prototype.setBrightness = function (level, callback) {
        this.logger("Setting brightness to " + level);
        if (level !== this.device.brightnessLevel) {
            this.device
                .updateBrightnessLevel(level).handleWith(callback);
        }
        else {
            this.logger("Ignoring redundant setBrightness");
            callback();
        }
    };
    // Handles a request to get the current brightness level for dimmable lights.
    ISYRelayAccessory.prototype.getBrightness = function (callback) {
        callback(null, this.device.brightnessLevel);
    };
    // Returns the set of services supported by this object.
    ISYRelayAccessory.prototype.setupServices = function () {
        var s = _super.prototype.setupServices.call(this);
        this.primaryService = this.platformAccessory.getOrAddService(hap_nodejs_1.Service.Switch);
        this.primaryService.getCharacteristic(hap_nodejs_1.Characteristic.On).on(hap_nodejs_1.CharacteristicEventTypes.SET, this.setPowerState.bind(this));
        this.primaryService.getCharacteristic(hap_nodejs_1.Characteristic.On).on(hap_nodejs_1.CharacteristicEventTypes.GET, this.getPowerState.bind(this));
        s.push(this.primaryService);
        return s;
    };
    return ISYRelayAccessory;
}(ISYDeviceAccessory_1.ISYDeviceAccessory));
exports.ISYRelayAccessory = ISYRelayAccessory;
