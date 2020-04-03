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
var HomeKit_1 = require("hap-nodejs/dist/lib/gen/HomeKit");
var ISYAccessory_1 = require("./ISYAccessory");
var utils_1 = require("./utils");
var ISYSceneAccessory = /** @class */ (function (_super) {
    __extends(ISYSceneAccessory, _super);
    function ISYSceneAccessory(scene) {
        var _this = _super.call(this, scene) || this;
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
    ISYSceneAccessory.prototype.setupServices = function () {
        var _this = this;
        _super.prototype.setupServices.call(this);
        if (this.dimmable) {
            this.lightService = this.platformAccessory.getOrAddService(hap_nodejs_1.Service.Lightbulb);
            utils_1.onSet(this.lightService.getCharacteristic(hap_nodejs_1.Characteristic.Brightness), this.bind(this.device.updateBrightnessLevel)).onGet(function () { return _this.device.brightnessLevel; });
        }
        else {
            this.lightService = this.platformAccessory.getOrAddService(HomeKit_1.Switch);
        }
        this.lightService
            .getCharacteristic(hap_nodejs_1.Characteristic.On)
            .onGet(function () { return _this.device.isOn; }).onSet(this.bind(this.device.updateIsOn));
        return [this.informationService, this.lightService];
    };
    return ISYSceneAccessory;
}(ISYAccessory_1.ISYAccessory));
exports.ISYSceneAccessory = ISYSceneAccessory;
