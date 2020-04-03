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
var ISYRelayAccessory_1 = require("./ISYRelayAccessory");
var InsteonDimmableAccessory = /** @class */ (function (_super) {
    __extends(InsteonDimmableAccessory, _super);
    function InsteonDimmableAccessory(device) {
        return _super.call(this, device) || this;
    }
    // Handles the identify command
    // Handles request to set the current powerstate from homekit. Will ignore redundant commands.
    InsteonDimmableAccessory.prototype.toCharacteristic = function (propertyName) {
        if (propertyName === 'ST')
            return hap_nodejs_1.Characteristic.Brightness;
        return null;
    };
    // Mirrors change in the state of the underlying isj-js device object.
    InsteonDimmableAccessory.prototype.handleExternalChange = function (propertyName, value, formattedValue) {
        _super.prototype.handleExternalChange.call(this, propertyName, value, formattedValue);
        //this.primaryService.getCharacteristic(Characteristic.On).updateValue(this.device.isOn);
        var ch = this.toCharacteristic(propertyName);
        if (ch !== null && ch !== undefined)
            this.primaryService.getCharacteristic(ch.name).updateValue(this.device[propertyName]);
    };
    // Handles request to get the current on state
    // Handles request to get the current on state
    // Handles a request to get the current brightness level for dimmable lights.
    InsteonDimmableAccessory.prototype.getBrightness = function (callback) {
        callback(null, this.device.level);
    };
    // Returns the set of services supported by this object.
    InsteonDimmableAccessory.prototype.setupServices = function () {
        var _this = this;
        var s = _super.prototype.setupServices.call(this);
        this.platformAccessory.removeService(this.primaryService);
        this.primaryService = this.platformAccessory.getOrAddService(hap_nodejs_1.Service.Lightbulb);
        this.primaryService.getCharacteristic(hap_nodejs_1.Characteristic.On).onSet(this.bind(this.device.updateIsOn));
        this.primaryService.getCharacteristic(hap_nodejs_1.Characteristic.On).onGet(function () { return _this.device.isOn; });
        // lightBulbService.getCharacteristic(Characteristic.On).on('get', this.getPowerState.bind(this));
        //this.primaryService.getCharacteristic(Characteristic.Brightness).updateValue(this.device['OL']);
        this.primaryService.getCharacteristic(hap_nodejs_1.Characteristic.Brightness).onGet(function () { return _this.device.brightnessLevel; });
        this.primaryService.getCharacteristic(hap_nodejs_1.Characteristic.Brightness).onSet(this.bind(this.device.updateBrightnessLevel));
        //this.primaryService.getCharacteristic(Characteristic.Brightness).setProps({maxValue: this.device.OL});
        return [this.informationService, this.primaryService];
    };
    return InsteonDimmableAccessory;
}(ISYRelayAccessory_1.ISYRelayAccessory));
exports.InsteonDimmableAccessory = InsteonDimmableAccessory;
