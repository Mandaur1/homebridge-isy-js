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
    // Mirrors change in the state of the underlying isj-js device object.
    ISYRelayAccessory.prototype.handleExternalChange = function (propertyName, value, formattedValue) {
        _super.prototype.handleExternalChange.call(this, propertyName, value, formattedValue);
        this.primaryService.getCharacteristic(hap_nodejs_1.Characteristic.On).updateValue(this.device.isOn);
    };
    // Returns the set of services supported by this object.
    ISYRelayAccessory.prototype.setupServices = function () {
        var _this = this;
        var s = _super.prototype.setupServices.call(this);
        this.primaryService = this.platformAccessory.getOrAddService(hap_nodejs_1.Service.Switch);
        this.primaryService.getCharacteristic(hap_nodejs_1.Characteristic.On).onGet(function () { return _this.device.isOn; }).onSet(this.bind(this.device.updateIsOn));
        s.push(this.primaryService);
        return s;
    };
    return ISYRelayAccessory;
}(ISYDeviceAccessory_1.ISYDeviceAccessory));
exports.ISYRelayAccessory = ISYRelayAccessory;
