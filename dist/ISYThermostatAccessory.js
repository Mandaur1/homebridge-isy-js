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
var hap_nodejs_1 = require("hap-nodejs");
var Service_1 = require("hap-nodejs/dist/lib/Service");
require("./utils");
var isy_js_1 = require("isy-js");
var ISYDeviceAccessory_1 = require("./ISYDeviceAccessory");
//import { Service } from 'homebridge/node_modules/hap-nodejs/dist/lib/Service';
//import { Characteristic } from 'homebridge/node_modules/hap-nodejs/dist/lib/Characteristic';
var ISYThermostatAccessory = /** @class */ (function (_super) {
    __extends(ISYThermostatAccessory, _super);
    function ISYThermostatAccessory(log, device) {
        return _super.call(this, log, device) || this;
    }
    ISYThermostatAccessory.prototype.toCelsius = function (temp) {
        return ((temp - 32.0) * 5.0) / 9.0;
    };
    ISYThermostatAccessory.prototype.toFahrenheit = function (temp) {
        return Math.round((temp * 9.0) / 5.0 + 32.0);
    };
    ISYThermostatAccessory.prototype.getCurrentTemperature = function (callback) {
        this.logger("Getting Current Temperature - Device says: " + this.device.currentTemperature + " says: " + this.toCelsius(this.device.currentTemperature));
        callback(null, this.toCelsius(this.device.currentTemperature));
    };
    ISYThermostatAccessory.prototype.getCoolSetPoint = function (callback) {
        this.logger("Getting Cooling Set Point - Device says: " + this.device.coolSetPoint + " translation says: " + this.toCelsius(this.device.coolSetPoint));
        callback(null, this.toCelsius(this.device.coolSetPoint));
    };
    ISYThermostatAccessory.prototype.getHeatSetPoint = function (callback) {
        this.logger("Getting Heating Set Point - Device says: " + this.device.heatSetPoint + " translation says: " + this.toCelsius(this.device.heatSetPoint));
        callback(null, this.toCelsius(this.device.heatSetPoint));
    };
    ISYThermostatAccessory.prototype.getMode = function (callback) {
        this.logger("Getting Heating Cooling Mode - Device says: " + this.device.mode);
        callback(null, this.device.mode);
    };
    ISYThermostatAccessory.prototype.getOperatingMode = function (callback) {
        this.logger("Getting Heating Cooling State - Device says: " + this.device.operatingMode);
        callback(null, this.device.operatingMode);
    };
    ISYThermostatAccessory.prototype.getFanMode = function (callback) {
        this.logger("Getting Fan State - Device says: " + this.device.fanMode);
        callback(null, this.device.fanMode);
    };
    ISYThermostatAccessory.prototype.getHumidity = function (callback) {
        this.logger("Getting Current Rel. Humidity - Device says: " + this.device.humidity);
        callback(null, this.device.humidity);
    };
    // Mirrors change in the state of the underlying isy-js device object.
    ISYThermostatAccessory.prototype.handleExternalChange = function (propertyName, value, formattedValue) {
        _super.prototype.handleExternalChange.call(this, propertyName, value, formattedValue);
        switch (propertyName) {
            case isy_js_1.Props.Status:
                this.thermostatService.getCharacteristic(hap_nodejs_1.Characteristic.CurrentTemperature).updateValue(this.toCelsius(this.device.currentTemperature));
                break;
            case isy_js_1.Props.Climate.CoolSetPoint:
                this.thermostatService.getCharacteristic(hap_nodejs_1.Characteristic.CoolingThresholdTemperature).updateValue(this.toCelsius(this.device.coolSetPoint));
                break;
            case isy_js_1.Props.Climate.HeatSetPoint:
                this.thermostatService.getCharacteristic(hap_nodejs_1.Characteristic.CoolingThresholdTemperature).updateValue(this.toCelsius(this.device.heatSetPoint));
                break;
            case isy_js_1.Props.Climate.OperatingMode:
                this.thermostatService.getCharacteristic(hap_nodejs_1.Characteristic.CurrentHeatingCoolingState).updateValue(this.device.operatingMode);
                break;
            case isy_js_1.Props.Climate.Mode:
                this.thermostatService.getCharacteristic(hap_nodejs_1.Characteristic.TargetHeatingCoolingState).updateValue(this.device.mode);
                break;
            case isy_js_1.Props.Climate.FanMode:
                this.thermostatService.getCharacteristic(hap_nodejs_1.Characteristic.CurrentFanState).updateValue(this.device.fanMode);
                break;
            case isy_js_1.Props.Climate.Humidity:
                this.thermostatService.getCharacteristic(hap_nodejs_1.Characteristic.CurrentRelativeHumidity).updateValue(this.device.humidity);
                break;
            default:
                break;
        }
    };
    ISYThermostatAccessory.prototype.getServices = function () {
        var _this = this;
        var svcs = _super.prototype.getServices.call(this);
        this.thermostatService = this.addService(Service_1.Service.Thermostat);
        // thermostatService.getCharacteristic(Characteristic.TargetTemperature).on("get", this.getTargetTemperature.bind(this));
        // thermostatService.getCharacteristic(Characteristic.TargetTemperature).on("set", this.setTargetTemperature.bind(this));
        this.thermostatService.setCharacteristic(hap_nodejs_1.Characteristic.TemperatureDisplayUnits, 1);
        this.thermostatService.addCharacteristic(hap_nodejs_1.Characteristic.CurrentFanState);
        this.thermostatService.getCharacteristic(hap_nodejs_1.Characteristic.CurrentFanState).on(hap_nodejs_1.CharacteristicEventTypes.GET, function (f) { return _this.getFanMode(f); });
        this.thermostatService.getCharacteristic(hap_nodejs_1.Characteristic.CurrentTemperature).on(hap_nodejs_1.CharacteristicEventTypes.GET, this.getCurrentTemperature.bind(this));
        this.thermostatService.getCharacteristic(hap_nodejs_1.Characteristic.CoolingThresholdTemperature).on(hap_nodejs_1.CharacteristicEventTypes.GET, this.getCoolSetPoint.bind(this));
        this.thermostatService.getCharacteristic(hap_nodejs_1.Characteristic.CoolingThresholdTemperature).on(hap_nodejs_1.CharacteristicEventTypes.SET, this.setCoolSetPoint.bind(this));
        this.thermostatService.getCharacteristic(hap_nodejs_1.Characteristic.HeatingThresholdTemperature).on(hap_nodejs_1.CharacteristicEventTypes.GET, this.getHeatSetPoint.bind(this));
        this.thermostatService.getCharacteristic(hap_nodejs_1.Characteristic.HeatingThresholdTemperature).on(hap_nodejs_1.CharacteristicEventTypes.SET, this.setHeatSetPoint.bind(this));
        this.thermostatService.getCharacteristic(hap_nodejs_1.Characteristic.CurrentHeatingCoolingState).on(hap_nodejs_1.CharacteristicEventTypes.GET, this.getOperatingMode.bind(this));
        this.thermostatService.getCharacteristic(hap_nodejs_1.Characteristic.TargetHeatingCoolingState).on(hap_nodejs_1.CharacteristicEventTypes.GET, this.getMode.bind(this));
        this.thermostatService.getCharacteristic(hap_nodejs_1.Characteristic.TargetHeatingCoolingState).on(hap_nodejs_1.CharacteristicEventTypes.SET, this.setHeatingCoolingMode.bind(this));
        this.thermostatService.getCharacteristic(hap_nodejs_1.Characteristic.CurrentRelativeHumidity).on(hap_nodejs_1.CharacteristicEventTypes.GET, this.getHumidity.bind(this));
        svcs.push(this.thermostatService);
        // ThermostatService
        //   .getCharacteristic(Characteristic.RotationSpeed)
        //   .on(CharacteristicEventTypes.SET, this.setThermostatRotationSpeed.bind(this));
        return svcs;
    };
    ISYThermostatAccessory.prototype.setCoolSetPoint = function (temp, callback) {
        this.logger("Sending command to set cool set point (pre-translate) to: " + temp);
        var newSetPoint = this.toFahrenheit(temp);
        this.logger("Sending command to set cool set point to: " + newSetPoint);
        if (Math.abs(newSetPoint - this.device.coolSetPoint) >= 1) {
            this.device.updateCoolSetPoint(newSetPoint).handleWith(callback);
        }
        else {
            this.logger("Command does not change actual set point");
            callback();
        }
    };
    ISYThermostatAccessory.prototype.setHeatSetPoint = function (temp, callback) {
        this.logger("Sending command to set heat set point (pre-translate) to: " + temp);
        var newSetPoint = this.toFahrenheit(temp);
        this.logger("Sending command to set heat set point to: " + newSetPoint);
        if (Math.abs(newSetPoint - this.device.heatSetPoint) >= 1) {
            this.device
                .updateHeatSetPoint(newSetPoint).handleWith(callback);
        }
        else {
            this.logger("Command does not change actual set point");
            callback();
        }
    };
    ISYThermostatAccessory.prototype.setHeatingCoolingMode = function (mode, callback) {
        this.logger("Sending command to set heating/cooling mode (pre-translate) to: " + mode);
        // this.logger("THERM: " + this.device.name + " Sending command to set cool set point to: " + newSetPoint);
        if (mode !== this.device.mode) {
            this.device
                .updateMode(mode).handleWith(callback);
        }
        else {
            this.logger("Command does not change actual mode");
            callback();
        }
    };
    return ISYThermostatAccessory;
}(ISYDeviceAccessory_1.ISYDeviceAccessory));
exports.ISYThermostatAccessory = ISYThermostatAccessory;
