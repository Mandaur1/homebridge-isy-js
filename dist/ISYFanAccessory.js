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
    function ISYFanAccessory(log, device) {
        var _this = _super.call(this, log, device) || this;
        //this.device.Motor.onPropertyChanged(null, this.handleExternalChangeToMotor.bind(this));
        _this.device.Light.onPropertyChanged(null, _this.handleExternalChangeToLight.bind(_this));
        return _this;
        // this.logger(JSON.stringify(this.device.scenes[0]));
    }
    // Translates the fan level from homebridge into the isy-js level. Maps from the 0-100
    // to the four isy-js fan speed levels.
    ISYFanAccessory.prototype.translateHKToFanSpeed = function (fanStateHK) {
        if (fanStateHK === 0) {
            return 0;
        }
        else if (fanStateHK > 0 && fanStateHK <= 25) {
            return 25;
        }
        else if (fanStateHK >= 33 && fanStateHK <= 75) {
            return 75;
        }
        else if (fanStateHK > 75) {
            return 100;
        }
        else {
            this.logger("ERROR: Unknown fan state!");
            return 0;
        }
    };
    // Returns the current state of the fan from the isy-js level to the 0-100 level of HK.
    ISYFanAccessory.prototype.getFanRotationSpeed = function (callback) {
        this.logger("Getting fan rotation speed. Device says: " + this.device.fanSpeed + " translation says: " + this.device.fanSpeed);
        callback(null, this.device.fanSpeed);
    };
    // Sets the current state of the fan from the 0-100 level of HK to the isy-js level.
    ISYFanAccessory.prototype.setFanRotationSpeed = function (fanStateHK, callback) {
        this.logger("Sending command to set fan state (pre-translate) to: " + fanStateHK);
        var newFanState = this.translateHKToFanSpeed(fanStateHK);
        this.logger("Sending command to set fan state to: " + fanStateHK);
        if (newFanState !== this.device.fanSpeed) {
            this.device
                .updateFanSpeed(newFanState).handleWith(callback);
        }
        else {
            this.logger("Fan command does not change actual speed");
            callback();
        }
    };
    ISYFanAccessory.prototype.getLightOnState = function () { };
    // Returns true if the fan is on
    ISYFanAccessory.prototype.getIsFanOn = function () {
        this.logger("Getting fan is on. Device says: " + this.device.isOn + " Code says: " + this.device.isOn);
        return this.device.isOn;
    };
    // Returns the state of the fan to the homebridge system for the On characteristic
    ISYFanAccessory.prototype.getFanOnState = function (callback) {
        callback(null, this.device.isOn);
    };
    // Sets the fan state based on the value of the On characteristic. Default to Medium for on.
    ISYFanAccessory.prototype.setFanOnState = function (onState, callback) {
        this.logger("Setting fan on state to: " + onState + " Device says: " + this.device.isOn);
        if (onState !== this.device.isOn) {
            if (onState) {
                this.logger('Turning fan on. Setting fan speed to high.');
                this.device
                    .updateIsOn(onState).handleWith(callback);
            }
            else {
                this.logger("Turning fan off.");
                this.device
                    .updateIsOn(onState).handleWith(callback);
            }
        }
        else {
            this.logger("Fan command does not change actual state");
            callback();
        }
    };
    ISYFanAccessory.prototype.setPowerState = function (powerOn, callback) {
        this.logger("Setting powerstate to " + powerOn);
        if (powerOn !== this.device.isOn) {
            this.logger("Changing powerstate to " + powerOn);
            this.device
                .updateIsOn(powerOn).handleWith(callback);
        }
        else {
            this.logger("Ignoring redundant setPowerState");
            callback();
        }
    };
    // Handles request to get the current on state
    ISYFanAccessory.prototype.getPowerState = function (callback) {
        callback(null, this.device.isOn);
    };
    // Handles request to set the brightness level of dimmable lights. Ignore redundant commands.
    ISYFanAccessory.prototype.setBrightness = function (level, callback) {
        this.logger("Setting brightness to " + level);
        if (level !== this.device.brightnessLevel) {
            this.device.updateBrightnessLevel(level);
        }
        else {
            this.logger("Ignoring redundant setBrightness");
            callback();
        }
    };
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
    ISYFanAccessory.prototype.getServices = function () {
        var _this = this;
        var s = _super.prototype.getServices.call(this);
        var fanService = this.addService(hap_nodejs_1.Service.Fan);
        this.fanService = fanService;
        var lightService = this.addService(hap_nodejs_1.Service.Lightbulb);
        this.lightService = lightService;
        fanService.getCharacteristic(hap_nodejs_1.Characteristic.RotationSpeed).onSet(this.device.Motor.updateFanSpeed.bind(this.device.Motor)).onGet(function () { return _this.device.Motor.fanSpeed; });
        fanService.getCharacteristic(hap_nodejs_1.Characteristic.On).onSet(this.device.Motor.updateIsOn.bind(this.device.Motor)).onGet(function () { return _this.device.Motor.isOn; });
        lightService.getCharacteristic(hap_nodejs_1.Characteristic.On).onSet(this.device.Light.updateIsOn.bind(this.device.Light)).onGet(function () { return _this.device.Light.isOn; });
        lightService.getCharacteristic(hap_nodejs_1.Characteristic.Brightness).onSet(this.device.Light.updateBrightnessLevel.bind(this.device.Light)).onGet(function () { return _this.device.Light.brightnessLevel; });
        this.setPrimaryService(fanService);
        s.push(fanService, lightService);
        return s;
    };
    return ISYFanAccessory;
}(ISYDeviceAccessory_1.ISYDeviceAccessory));
exports.ISYFanAccessory = ISYFanAccessory;
