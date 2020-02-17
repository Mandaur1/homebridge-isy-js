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
var ISYRelayAccessory_1 = require("./ISYRelayAccessory");
require("./utils");
var ISYDimmableAccessory = /** @class */ (function (_super) {
    __extends(ISYDimmableAccessory, _super);
    function ISYDimmableAccessory(log, device) {
        return _super.call(this, log, device) || this;
    }
    // Handles the identify command
    // Handles request to set the current powerstate from homekit. Will ignore redundant commands.
    ISYDimmableAccessory.prototype.toCharacteristic = function (propertyName) {
        if (propertyName === 'ST')
            return hap_nodejs_1.Characteristic.Brightness;
        return null;
    };
    // Mirrors change in the state of the underlying isj-js device object.
    ISYDimmableAccessory.prototype.handleExternalChange = function (propertyName, value, formattedValue) {
        _super.prototype.handleExternalChange.call(this, propertyName, value, formattedValue);
        //this.primaryService.getCharacteristic(Characteristic.On).updateValue(this.device.isOn);
        this.primaryService.getCharacteristic(hap_nodejs_1.Characteristic.Brightness).updateValue(this.device.level);
    };
    // Handles request to get the current on state
    // Handles request to get the current on state
    // Handles request to set the brightness level of dimmable lights. Ignore redundant commands.
    ISYDimmableAccessory.prototype.setBrightness = function (level, callback) {
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
    ISYDimmableAccessory.prototype.getBrightness = function (callback) {
        callback(null, this.device.level);
    };
    // Returns the set of services supported by this object.
    ISYDimmableAccessory.prototype.getServices = function () {
        var s = _super.prototype.getServices.call(this);
        this.primaryService.removeAllListeners();
        this.removeService(this.primaryService);
        this.primaryService = this.addService(hap_nodejs_1.Service.Lightbulb);
        this.primaryService.getCharacteristic(hap_nodejs_1.Characteristic.On).onSet(this.device.updateIsOn.bind(this.device));
        this.primaryService.getCharacteristic(hap_nodejs_1.Characteristic.On).on(hap_nodejs_1.CharacteristicEventTypes.GET, this.getPowerState.bind(this));
        // lightBulbService.getCharacteristic(Characteristic.On).on('get', this.getPowerState.bind(this));
        this.primaryService.getCharacteristic(hap_nodejs_1.Characteristic.Brightness).on(hap_nodejs_1.CharacteristicEventTypes.GET, this.getBrightness.bind(this));
        this.primaryService.getCharacteristic(hap_nodejs_1.Characteristic.Brightness).onSet(this.device.updateBrightnessLevel.bind(this.device));
        return [this.informationService, this.primaryService];
    };
    return ISYDimmableAccessory;
}(ISYRelayAccessory_1.ISYRelayAccessory));
exports.ISYDimmableAccessory = ISYDimmableAccessory;
