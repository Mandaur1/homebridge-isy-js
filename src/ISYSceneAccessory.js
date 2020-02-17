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
var ISYAccessory_1 = require("./ISYAccessory");
require("./utils");
var HomeKit_1 = require("homebridge/node_modules/hap-nodejs/dist/lib/gen/HomeKit");
var utils_1 = require("./utils");
var ISYSceneAccessory = /** @class */ (function (_super) {
    __extends(ISYSceneAccessory, _super);
    function ISYSceneAccessory(log, scene) {
        var _this = _super.call(this, log, scene) || this;
        _this.scene = scene;
        _this.dimmable = scene.isDimmable;
        return _this;
        // this.logger = function(msg) {log("Scene Accessory: " + scene.name + ": " + msg); };
    }
    // Handles the identify command
    ISYSceneAccessory.prototype.identify = function (callback) {
        var that = this;
    };
    // Handles request to set the current powerstate from homekit. Will ignore redundant commands.
    ISYSceneAccessory.prototype.setPowerState = function (powerOn, callback) {
        this.logger("Setting powerstate to " + powerOn);
        if (this.scene.isOn !== powerOn) {
            this.logger("Changing powerstate to " + powerOn);
            this.scene.updateBrightnessLevel(powerOn).handleWith(callback);
        }
        else {
            this.logger("Ignoring redundant setPowerState");
            callback();
        }
    };
    ISYSceneAccessory.prototype.setBrightness = function (level, callback) {
        this.logger("Setting brightness to " + level);
        if (level !== this.scene.brightnessLevel) {
            this.scene.updateBrightnessLevel(level).handleWith(callback);
        }
        else {
            this.logger("Ignoring redundant setBrightness");
            callback();
        }
    };
    // Handles a request to get the current brightness level for dimmable lights.
    ISYSceneAccessory.prototype.getBrightness = function (callback) {
        callback(null, this.scene.brightnessLevel);
    };
    // Mirrors change in the state of the underlying isj-js device object.
    ISYSceneAccessory.prototype.handleExternalChange = function (propertyName, value, formattedValue) {
        this.lightService.getCharacteristic(hap_nodejs_1.Characteristic.On).updateValue(this.scene.isOn);
        if (this.dimmable) {
            this.lightService.getCharacteristic(hap_nodejs_1.Characteristic.Brightness).updateValue(this.scene.brightnessLevel);
        }
    };
    // Handles request to get the current on state
    ISYSceneAccessory.prototype.getPowerState = function (callback) {
        callback(null, this.scene.isOn);
    };
    // Returns the set of services supported by this object.
    ISYSceneAccessory.prototype.getServices = function () {
        var _this = this;
        _super.prototype.getServices.call(this);
        if (this.dimmable) {
            this.lightService = this.addService(HomeKit_1.StatelessProgrammableSwitch);
            utils_1.onSet(this.lightService.getCharacteristic(hap_nodejs_1.Characteristic.Brightness), this.device.updateBrightnessLevel).on(hap_nodejs_1.CharacteristicEventTypes.GET, function (f) { return _this.getBrightness(f); });
        }
        else {
            this.lightService = this.addService(HomeKit_1.Switch);
        }
        this.lightService
            .getCharacteristic(hap_nodejs_1.Characteristic.On)
            .on(hap_nodejs_1.CharacteristicEventTypes.SET, this.setPowerState.bind(this))
            .on(hap_nodejs_1.CharacteristicEventTypes.GET, this.getPowerState.bind(this));
        return [this.informationService, this.lightService];
    };
    return ISYSceneAccessory;
}(ISYAccessory_1.ISYAccessory));
exports.ISYSceneAccessory = ISYSceneAccessory;
