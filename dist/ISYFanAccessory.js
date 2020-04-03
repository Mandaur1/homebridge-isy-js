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
require("./ISYPlatform");
var hap_nodejs_1 = require("hap-nodejs");
var ISYDeviceAccessory_1 = require("./ISYDeviceAccessory");
var ISYFanAccessory = /** @class */ (function (_super) {
    __extends(ISYFanAccessory, _super);
    function ISYFanAccessory(device) {
        var _this = _super.call(this, device) || this;
        device.propertyChanged.removeListener(null, _super.prototype.handleExternalChange);
        _this.device.Motor.onPropertyChanged(null, _this.handleExternalChangeToMotor.bind(_this));
        _this.device.Light.onPropertyChanged(null, _this.handleExternalChangeToLight.bind(_this));
        return _this;
        // this.logger(JSON.stringify(this.device.scenes[0]));
    }
    // Translates the fan level from homebridge into the isy-js level. Maps from the 0-100
    // to the four isy-js fan speed levels.
    // Handles a request to get the current brightness level for dimmable lights.
    ISYFanAccessory.prototype.getBrightness = function (callback) {
        callback(null, this.device.brightnessLevel);
    };
    // Mirrors change in the state of the underlying isj-js device object.
    ISYFanAccessory.prototype.handleExternalChangeToMotor = function (propertyName, value, formattedValue) {
        _super.prototype.handleExternalChange.call(this, propertyName, value, formattedValue);
        this.fanService.getCharacteristic(hap_nodejs_1.Characteristic.On).updateValue(this.device.isOn);
        this.fanService.getCharacteristic(hap_nodejs_1.Characteristic.RotationSpeed).updateValue(this.device.fanSpeed);
    };
    ISYFanAccessory.prototype.handleExternalChangeToLight = function (propertyName, value, formattedValue) {
        _super.prototype.handleExternalChange.call(this, propertyName, value, formattedValue);
        this.lightService
            .getCharacteristic(hap_nodejs_1.Characteristic.On).updateValue(this.device.Light.isOn);
        if (this.dimmable) {
            this.lightService
                .getCharacteristic(hap_nodejs_1.Characteristic.Brightness).updateValue(this.device.Light.level);
        }
    };
    // Returns the services supported by the fan device.
    ISYFanAccessory.prototype.setupServices = function () {
        var _this = this;
        var s = _super.prototype.setupServices.call(this);
        var fanService = this.platformAccessory.getOrAddService(hap_nodejs_1.Service.Fan);
        this.fanService = fanService;
        var lightService = this.platformAccessory.getOrAddService(hap_nodejs_1.Service.Lightbulb);
        this.lightService = lightService;
        fanService.getCharacteristic(hap_nodejs_1.Characteristic.RotationSpeed).onSet(this.device.Motor.updateFanSpeed.bind(this.device.Motor)).onGet(function () { return _this.device.Motor.fanSpeed; });
        fanService.getCharacteristic(hap_nodejs_1.Characteristic.On).onSet(this.device.Motor.updateIsOn.bind(this.device.Motor)).onGet(function () { return _this.device.Motor.isOn; });
        lightService.getCharacteristic(hap_nodejs_1.Characteristic.On).onSet(this.device.Light.updateIsOn.bind(this.device.Light)).onGet(function () { return _this.device.Light.isOn; });
        lightService.getCharacteristic(hap_nodejs_1.Characteristic.Brightness).onSet(this.device.Light.updateBrightnessLevel.bind(this.device.Light)).onGet(function () { return _this.device.Light.brightnessLevel; });
        fanService.isPrimaryService = true;
        s.push(fanService, lightService);
        return s;
    };
    return ISYFanAccessory;
}(ISYDeviceAccessory_1.ISYDeviceAccessory));
exports.ISYFanAccessory = ISYFanAccessory;
