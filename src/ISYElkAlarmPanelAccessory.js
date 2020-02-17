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
require("./utils");
var hap_nodejs_1 = require("homebridge/node_modules/hap-nodejs");
var ISYElkAlarmPanelAccessory = /** @class */ (function (_super) {
    __extends(ISYElkAlarmPanelAccessory, _super);
    function ISYElkAlarmPanelAccessory(log, device) {
        return _super.call(this, log, device) || this;
    }
    // Handles the identify command
    ISYElkAlarmPanelAccessory.prototype.identify = function (callback) {
        callback();
    };
    // Handles the request to set the alarm target state
    ISYElkAlarmPanelAccessory.prototype.setAlarmTargetState = function (targetStateHK, callback) {
        this.logger('ALARMSYSTEM: ' + this.device.name + 'Sending command to set alarm panel state to: ' + targetStateHK);
        var targetState = this.translateHKToAlarmTargetState(targetStateHK);
        this.logger('ALARMSYSTEM: ' + this.device.name + ' Would send the target state of: ' + targetState);
        if (this.device.getAlarmMode() !== targetState) {
            this.device.sendSetAlarmModeCommand(targetState, function (result) {
                callback();
            });
        }
        else {
            this.logger('ALARMSYSTEM: ' + this.device.name + ' Redundant command, already in that state.');
            callback();
        }
    };
    // Translates from the current state of the elk alarm system into a homekit compatible state. The elk panel has a lot more
    // possible states then can be directly represented by homekit so we map them. If the alarm is going off then it is tripped.
    // If it is arming or armed it is considered armed. Stay maps to the state state, away to the away state, night to the night
    // state.
    ISYElkAlarmPanelAccessory.prototype.translateAlarmCurrentStateToHK = function () {
        var tripState = this.device.getAlarmTripState();
        var sourceAlarmState = this.device.getAlarmState();
        var sourceAlarmMode = this.device.getAlarmMode();
        if (tripState >= this.device.ALARM_TRIP_STATE_TRIPPED) {
            return hap_nodejs_1.Characteristic.SecuritySystemCurrentState.ALARM_TRIGGERED;
        }
        else if (sourceAlarmState === this.device.ALARM_STATE_NOT_READY_TO_ARM || sourceAlarmState === this.device.ALARM_STATE_READY_TO_ARM || sourceAlarmState === this.device.ALARM_STATE_READY_TO_ARM_VIOLATION) {
            return hap_nodejs_1.Characteristic.SecuritySystemCurrentState.DISARMED;
        }
        else {
            if (sourceAlarmMode === this.device.ALARM_MODE_STAY || sourceAlarmMode === this.device.ALARM_MODE_STAY_INSTANT) {
                return hap_nodejs_1.Characteristic.SecuritySystemCurrentState.STAY_ARM;
            }
            else if (sourceAlarmMode === this.device.ALARM_MODE_AWAY || sourceAlarmMode === this.device.ALARM_MODE_VACATION) {
                return hap_nodejs_1.Characteristic.SecuritySystemCurrentState.AWAY_ARM;
            }
            else if (sourceAlarmMode === this.device.ALARM_MODE_NIGHT || sourceAlarmMode === this.device.ALARM_MODE_NIGHT_INSTANT) {
                return hap_nodejs_1.Characteristic.SecuritySystemCurrentState.NIGHT_ARM;
            }
            else {
                this.logger('ALARMSYSTEM: ' + this.device.name + ' Setting to disarmed because sourceAlarmMode is ' + sourceAlarmMode);
                return hap_nodejs_1.Characteristic.SecuritySystemCurrentState.DISARMED;
            }
        }
    };
    // Translates the current target state of hthe underlying alarm into the appropriate homekit value
    ISYElkAlarmPanelAccessory.prototype.translateAlarmTargetStateToHK = function () {
        var sourceAlarmState = this.device.getAlarmMode();
        if (sourceAlarmState === this.device.ALARM_MODE_STAY || sourceAlarmState === this.device.ALARM_MODE_STAY_INSTANT) {
            return hap_nodejs_1.Characteristic.SecuritySystemTargetState.STAY_ARM;
        }
        else if (sourceAlarmState === this.device.ALARM_MODE_AWAY || sourceAlarmState === this.device.ALARM_MODE_VACATION) {
            return hap_nodejs_1.Characteristic.SecuritySystemTargetState.AWAY_ARM;
        }
        else if (sourceAlarmState === this.device.ALARM_MODE_NIGHT || sourceAlarmState === this.device.ALARM_MODE_NIGHT_INSTANT) {
            return hap_nodejs_1.Characteristic.SecuritySystemTargetState.NIGHT_ARM;
        }
        else {
            return hap_nodejs_1.Characteristic.SecuritySystemTargetState.DISARM;
        }
    };
    // Translates the homekit version of the alarm target state into the appropriate elk alarm panel state
    ISYElkAlarmPanelAccessory.prototype.translateHKToAlarmTargetState = function (state) {
        if (state === hap_nodejs_1.Characteristic.SecuritySystemTargetState.STAY_ARM) {
            return this.device.ALARM_MODE_STAY;
        }
        else if (state === hap_nodejs_1.Characteristic.SecuritySystemTargetState.AWAY_ARM) {
            return this.device.ALARM_MODE_AWAY;
        }
        else if (state === hap_nodejs_1.Characteristic.SecuritySystemTargetState.NIGHT_ARM) {
            return this.device.ALARM_MODE_NIGHT;
        }
        else {
            return this.device.ALARM_MODE_DISARMED;
        }
    };
    // Handles request to get the target alarm state
    ISYElkAlarmPanelAccessory.prototype.getAlarmTargetState = function (callback) {
        callback(null, this.translateAlarmTargetStateToHK());
    };
    // Handles request to get the current alarm state
    ISYElkAlarmPanelAccessory.prototype.getAlarmCurrentState = function (callback) {
        callback(null, this.translateAlarmCurrentStateToHK());
    };
    // Mirrors change in the state of the underlying isj-js device object.
    ISYElkAlarmPanelAccessory.prototype.handleExternalChange = function (propertyName, value, formattedValue) {
        _super.prototype.handleExternalChange.call(this, propertyName, value, formattedValue);
        this.logger("ALARMPANEL: " + this.device.name + " Source device. Currenty state locally -" + this.device.getAlarmStatusAsText());
        this.logger("ALARMPANEL: " + this.device.name + " Got alarm change notification. Setting HK target state to: " + this.translateAlarmTargetStateToHK() + " Setting HK Current state to: " + this.translateAlarmCurrentStateToHK());
        this.alarmPanelService.setCharacteristic(hap_nodejs_1.Characteristic.SecuritySystemTargetState, this.translateAlarmTargetStateToHK());
        this.alarmPanelService.setCharacteristic(hap_nodejs_1.Characteristic.SecuritySystemCurrentState, this.translateAlarmCurrentStateToHK());
    };
    // Returns the set of services supported by this object.
    ISYElkAlarmPanelAccessory.prototype.getServices = function () {
        var s = _super.prototype.getServices.call(this);
        this.alarmPanelService = this.addService(hap_nodejs_1.Service.SecuritySystem);
        this.alarmPanelService.getCharacteristic(hap_nodejs_1.Characteristic.SecuritySystemTargetState).on('set', this.setAlarmTargetState.bind(this));
        this.alarmPanelService.getCharacteristic(hap_nodejs_1.Characteristic.SecuritySystemTargetState).on('get', this.getAlarmTargetState.bind(this));
        this.alarmPanelService.getCharacteristic(hap_nodejs_1.Characteristic.SecuritySystemCurrentState).on('get', this.getAlarmCurrentState.bind(this));
        s.push(this.alarmPanelService);
        return s;
    };
    return ISYElkAlarmPanelAccessory;
}(ISYAccessory_1.ISYAccessory));
exports.ISYElkAlarmPanelAccessory = ISYElkAlarmPanelAccessory;
