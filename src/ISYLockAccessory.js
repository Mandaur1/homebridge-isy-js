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
var ISYDeviceAccessory_1 = require("./ISYDeviceAccessory");
var hap_nodejs_1 = require("homebridge/node_modules/hap-nodejs");
var ISYLockAccessory = /** @class */ (function (_super) {
    __extends(ISYLockAccessory, _super);
    function ISYLockAccessory(log, device) {
        return _super.call(this, log, device) || this;
    }
    // Handles an identify request
    ISYLockAccessory.prototype.identify = function (callback) {
        callback();
    };
    // Handles a set to the target lock state. Will ignore redundant commands.
    ISYLockAccessory.prototype.setTargetLockState = function (lockState, callback) {
        this.logger("Sending command to set lock state to: " + lockState);
        if (lockState !== this.getDeviceCurrentStateAsHK()) {
            var targetLockValue = lockState === 0 ? false : true;
            this.device.sendLockCommand(targetLockValue, callback);
        }
        else {
            callback();
        }
    };
    // Translates underlying lock state into the corresponding homekit state
    ISYLockAccessory.prototype.getDeviceCurrentStateAsHK = function () {
        return this.device.getCurrentLockState() ? 1 : 0;
    };
    // Handles request to get the current lock state for homekit
    ISYLockAccessory.prototype.getLockCurrentState = function (callback) {
        callback(null, this.getDeviceCurrentStateAsHK());
    };
    // Handles request to get the target lock state for homekit
    ISYLockAccessory.prototype.getTargetLockState = function (callback) {
        this.getLockCurrentState(callback);
    };
    // Mirrors change in the state of the underlying isy-js device object.
    ISYLockAccessory.prototype.handleExternalChange = function (propertyName, value, formattedValue) {
        this.lockService.updateCharacteristic(hap_nodejs_1.Characteristic.LockTargetState, this.getDeviceCurrentStateAsHK());
        this.lockService.updateCharacteristic(hap_nodejs_1.Characteristic.LockCurrentState, this.getDeviceCurrentStateAsHK());
    };
    // Returns the set of services supported by this object.
    ISYLockAccessory.prototype.getServices = function () {
        _super.prototype.getServices.call(this);
        var lockMechanismService = this.addService(hap_nodejs_1.Service.LockMechanism);
        this.lockService = lockMechanismService;
        lockMechanismService.getCharacteristic(hap_nodejs_1.Characteristic.LockTargetState).on(hap_nodejs_1.CharacteristicEventTypes.SET, this.setTargetLockState.bind(this));
        lockMechanismService.getCharacteristic(hap_nodejs_1.Characteristic.LockTargetState).on(hap_nodejs_1.CharacteristicEventTypes.GET, this.getTargetLockState.bind(this));
        lockMechanismService.getCharacteristic(hap_nodejs_1.Characteristic.LockCurrentState).on(hap_nodejs_1.CharacteristicEventTypes.GET, this.getLockCurrentState.bind(this));
        return [this.informationService, lockMechanismService];
    };
    return ISYLockAccessory;
}(ISYDeviceAccessory_1.ISYDeviceAccessory));
exports.ISYLockAccessory = ISYLockAccessory;
