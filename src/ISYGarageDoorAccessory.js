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
var ISYAccessory_1 = require("./ISYAccessory");
var hap_nodejs_1 = require("homebridge/node_modules/hap-nodejs");
var ISYGarageDoorAccessory = /** @class */ (function (_super) {
    __extends(ISYGarageDoorAccessory, _super);
    function ISYGarageDoorAccessory(log, sensorDevice, relayDevice, name, timeToOpen, alternate) {
        var _this = _super.call(this, log, sensorDevice) || this;
        _this.timeToOpen = timeToOpen;
        _this.relayDevice = relayDevice;
        _this.alternate = alternate === undefined ? false : alternate;
        if (_this.getSensorState()) {
            _this.logger("GARAGE: " + _this.name + " Initial set during startup the sensor is open so defaulting states to open");
            _this.targetGarageState = hap_nodejs_1.Characteristic.TargetDoorState.OPEN;
            _this.currentGarageState = hap_nodejs_1.Characteristic.CurrentDoorState.OPEN;
        }
        else {
            _this.logger("GARAGE: " + _this.name + " Initial set during startup the sensor is closed so defaulting states to closed");
            _this.targetGarageState = hap_nodejs_1.Characteristic.TargetDoorState.CLOSED;
            _this.currentGarageState = hap_nodejs_1.Characteristic.CurrentDoorState.CLOSED;
        }
        return _this;
    }
    ISYGarageDoorAccessory.prototype.getSensorState = function () {
        if (this.alternate) {
            return !this.device.getCurrentDoorWindowState();
        }
        else {
            return this.device.getCurrentDoorWindowState();
        }
    };
    // Handles an identify request
    ISYGarageDoorAccessory.prototype.identify = function (callback) {
        callback();
    };
    ISYGarageDoorAccessory.prototype.sendGarageDoorCommand = function (callback) {
        this.relayDevice.sendLightCommand(true, function () {
            callback();
        });
    };
    // Handles a set to the target lock state. Will ignore redundant commands.
    ISYGarageDoorAccessory.prototype.setTargetDoorState = function (targetState, callback) {
        var that = this;
        if (targetState === this.targetGarageState) {
            this.logger('GARAGE: Ignoring redundant set of target state');
            callback();
            return;
        }
        this.targetGarageState = targetState;
        if (this.currentGarageState === hap_nodejs_1.Characteristic.CurrentDoorState.OPEN) {
            if (targetState === hap_nodejs_1.Characteristic.TargetDoorState.CLOSED) {
                this.logger("GARAGE: Current state is open and target is closed. Changing state to closing and sending command");
                this.garageDoorService.setCharacteristic(hap_nodejs_1.Characteristic.CurrentDoorState, hap_nodejs_1.Characteristic.CurrentDoorState.CLOSING);
                this.sendGarageDoorCommand(callback);
            }
        }
        else if (this.currentGarageState === hap_nodejs_1.Characteristic.CurrentDoorState.CLOSED) {
            if (targetState === hap_nodejs_1.Characteristic.TargetDoorState.OPEN) {
                this.logger("GARAGE: Current state is closed and target is open. Waiting for sensor change to trigger opening state");
                this.sendGarageDoorCommand(callback);
                return;
            }
        }
        else if (this.currentGarageState === hap_nodejs_1.Characteristic.CurrentDoorState.OPENING) {
            if (targetState === hap_nodejs_1.Characteristic.TargetDoorState.CLOSED) {
                this.logger("GARAGE: " + this.device.name + " Current state is opening and target is closed. Sending command and changing state to closing");
                this.garageDoorService.setCharacteristic(hap_nodejs_1.Characteristic.CurrentDoorState, hap_nodejs_1.Characteristic.CurrentDoorState.CLOSING);
                this.sendGarageDoorCommand(function () { return setTimeout(function () { return that.sendGarageDoorCommand(callback); }, 3000); });
                return;
            }
        }
        else if (this.currentGarageState === hap_nodejs_1.Characteristic.CurrentDoorState.CLOSING) {
            if (targetState === hap_nodejs_1.Characteristic.TargetDoorState.OPEN) {
                this.logger("GARAGE: " + this.device.name + " Current state is closing and target is open. Sending command and setting timeout to complete");
                this.garageDoorService.setCharacteristic(hap_nodejs_1.Characteristic.CurrentDoorState, hap_nodejs_1.Characteristic.CurrentDoorState.OPENING);
                this.sendGarageDoorCommand(function () {
                    that.sendGarageDoorCommand(callback);
                    setTimeout(that.completeOpen.bind(that), that.timeToOpen);
                });
            }
        }
    };
    // Handles request to get the current lock state for homekit
    ISYGarageDoorAccessory.prototype.getCurrentDoorState = function (callback) {
        callback(null, this.currentGarageState);
    };
    ISYGarageDoorAccessory.prototype.setCurrentDoorState = function (newState, callback) {
        this.currentGarageState = newState;
        callback();
    };
    // Handles request to get the target lock state for homekit
    ISYGarageDoorAccessory.prototype.getTargetDoorState = function (callback) {
        callback(null, this.targetGarageState);
    };
    ISYGarageDoorAccessory.prototype.completeOpen = function () {
        if (this.currentGarageState === hap_nodejs_1.Characteristic.CurrentDoorState.OPENING) {
            this.logger('Current door has bee opening long enough, marking open');
            this.garageDoorService.setCharacteristic(hap_nodejs_1.Characteristic.CurrentDoorState, hap_nodejs_1.Characteristic.CurrentDoorState.OPEN);
        }
        else {
            this.logger('Opening aborted so not setting opened state automatically');
        }
    };
    // Mirrors change in the state of the underlying isj-js device object.
    ISYGarageDoorAccessory.prototype.handleExternalChange = function (propertyName, value, formattedValue) {
        _super.prototype.handleExternalChange.call(this, propertyName, value, formattedValue);
        if (this.getSensorState()) {
            if (this.currentGarageState === hap_nodejs_1.Characteristic.CurrentDoorState.OPEN) {
                this.logger("GARAGE:  " + this.device.name + "Current state of door is open and now sensor matches. No action to take");
            }
            else if (this.currentGarageState === hap_nodejs_1.Characteristic.CurrentDoorState.CLOSED) {
                this.logger("GARAGE:  " + this.device.name + "Current state of door is closed and now sensor says open. Setting state to opening");
                this.garageDoorService.setCharacteristic(hap_nodejs_1.Characteristic.CurrentDoorState, hap_nodejs_1.Characteristic.CurrentDoorState.OPENING);
                this.targetGarageState = hap_nodejs_1.Characteristic.TargetDoorState.OPEN;
                this.garageDoorService.setCharacteristic(hap_nodejs_1.Characteristic.TargetDoorState, hap_nodejs_1.Characteristic.CurrentDoorState.OPEN);
                setTimeout(this.completeOpen.bind(this), this.timeToOpen);
            }
            else if (this.currentGarageState === hap_nodejs_1.Characteristic.CurrentDoorState.OPENING) {
                this.logger("GARAGE:  " + this.device.name + "Current state of door is opening and now sensor matches. No action to take");
            }
            else if (this.currentGarageState === hap_nodejs_1.Characteristic.CurrentDoorState.CLOSING) {
                this.logger('GARAGE: C ' + this.device.name + 'Current state of door is closing and now sensor matches. No action to take');
            }
        }
        else {
            if (this.currentGarageState === hap_nodejs_1.Characteristic.CurrentDoorState.OPEN) {
                this.logger('GARAGE:  ' + this.device.name + 'Current state of door is open and now sensor shows closed. Setting current state to closed');
                this.garageDoorService.setCharacteristic(hap_nodejs_1.Characteristic.CurrentDoorState, hap_nodejs_1.Characteristic.CurrentDoorState.CLOSED);
                this.targetGarageState = hap_nodejs_1.Characteristic.TargetDoorState.CLOSED;
                this.garageDoorService.setCharacteristic(hap_nodejs_1.Characteristic.TargetDoorState, hap_nodejs_1.Characteristic.TargetDoorState.CLOSED);
            }
            else if (this.currentGarageState === hap_nodejs_1.Characteristic.CurrentDoorState.CLOSED) {
                this.logger('GARAGE:  ' + this.device.name + 'Current state of door is closed and now sensor shows closed. No action to take');
            }
            else if (this.currentGarageState === hap_nodejs_1.Characteristic.CurrentDoorState.OPENING) {
                this.logger('GARAGE:  ' + this.device.name + 'Current state of door is opening and now sensor shows closed. Setting current state to closed');
                this.garageDoorService.setCharacteristic(hap_nodejs_1.Characteristic.CurrentDoorState, hap_nodejs_1.Characteristic.CurrentDoorState.CLOSED);
                this.targetGarageState = hap_nodejs_1.Characteristic.TargetDoorState.CLOSED;
                this.garageDoorService.setCharacteristic(hap_nodejs_1.Characteristic.TargetDoorState, hap_nodejs_1.Characteristic.TargetDoorState.CLOSED);
            }
            else if (this.currentGarageState === hap_nodejs_1.Characteristic.CurrentDoorState.CLOSING) {
                this.logger("GARAGE:  " + this.device.name + "Current state of door is closing and now sensor shows closed. Setting current state to closed");
                this.garageDoorService.setCharacteristic(hap_nodejs_1.Characteristic.CurrentDoorState, hap_nodejs_1.Characteristic.CurrentDoorState.CLOSED);
                this.targetGarageState = hap_nodejs_1.Characteristic.TargetDoorState.CLOSED;
                this.garageDoorService.setCharacteristic(hap_nodejs_1.Characteristic.TargetDoorState, hap_nodejs_1.Characteristic.TargetDoorState.CLOSED);
            }
        }
    };
    ISYGarageDoorAccessory.prototype.getObstructionState = function (callback) {
        callback(null, false);
    };
    // Returns the set of services supported by this object.
    ISYGarageDoorAccessory.prototype.getServices = function () {
        _super.prototype.getServices.call(this);
        var garageDoorService = this.addService(hap_nodejs_1.Service.GarageDoorOpener);
        this.garageDoorService = garageDoorService;
        garageDoorService.getCharacteristic(hap_nodejs_1.Characteristic.TargetDoorState).on(hap_nodejs_1.CharacteristicEventTypes.SET, this.setTargetDoorState.bind(this));
        garageDoorService.getCharacteristic(hap_nodejs_1.Characteristic.TargetDoorState).on(hap_nodejs_1.CharacteristicEventTypes.GET, this.getTargetDoorState.bind(this));
        garageDoorService.getCharacteristic(hap_nodejs_1.Characteristic.CurrentDoorState).on(hap_nodejs_1.CharacteristicEventTypes.GET, this.getCurrentDoorState.bind(this));
        garageDoorService.getCharacteristic(hap_nodejs_1.Characteristic.CurrentDoorState).on(hap_nodejs_1.CharacteristicEventTypes.SET, this.setCurrentDoorState.bind(this));
        garageDoorService.getCharacteristic(hap_nodejs_1.Characteristic.ObstructionDetected).on(hap_nodejs_1.CharacteristicEventTypes.GET, this.getObstructionState.bind(this));
        return [this.informationService, garageDoorService];
    };
    return ISYGarageDoorAccessory;
}(ISYAccessory_1.ISYAccessory));
exports.ISYGarageDoorAccessory = ISYGarageDoorAccessory;
