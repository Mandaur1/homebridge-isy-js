"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ISYElkAlarmPanelAccessory = void 0;
require("./utils");
const ElkAlarmPanelDevice_1 = require("isy-nodejs/lib/Devices/Elk/ElkAlarmPanelDevice");
const ISYAccessory_1 = require("./ISYAccessory");
const plugin_1 = require("./plugin");
class ISYElkAlarmPanelAccessory extends ISYAccessory_1.ISYAccessory {
    // Handles the request to set the alarm target state
    setAlarmTargetState(targetStateHK, callback) {
        this.logger.info(`ALARMSYSTEM: ${this.device.name} Sending command to set alarm panel state to: ${targetStateHK}`);
        const targetState = this.translateHKToAlarmTargetState(targetStateHK);
        this.logger.info(`ALARMSYSTEM: ${this.device.name} Would send the target state of: ${targetState}`);
        if (this.device.getAlarmMode() !== targetState) {
            // tslint:disable-next-line: only-arrow-functions
            this.device.sendSetAlarmModeCommand(targetState.toString());
        }
        else {
            this.logger.info(`ALARMSYSTEM: ${this.device.name} Redundant command, already in that state.`);
            callback();
        }
    }
    // Translates from the current state of the elk alarm system into a homekit compatible state. The elk panel has a lot more
    // possible states then can be directly represented by homekit so we map them. If the alarm is going off then it is tripped.
    // If it is arming or armed it is considered armed. Stay maps to the state state, away to the away state, night to the night
    // state.
    translateAlarmCurrentStateToHK() {
        const tripState = this.device.getAlarmTripState();
        const sourceAlarmState = this.device.getAlarmState();
        const sourceAlarmMode = this.device.getAlarmMode();
        if (tripState >= this.device.ALARM_TRIP_STATE_TRIPPED) {
            return plugin_1.Characteristic.SecuritySystemCurrentState.ALARM_TRIGGERED;
        }
        else if (sourceAlarmState === this.device.ALARM_STATE_NOT_READY_TO_ARM || sourceAlarmState === this.device.ALARM_STATE_READY_TO_ARM || sourceAlarmState === this.device.ALARM_STATE_READY_TO_ARM_VIOLATION) {
            return plugin_1.Characteristic.SecuritySystemCurrentState.DISARMED;
        }
        else {
            if (sourceAlarmMode === ElkAlarmPanelDevice_1.AlarmMode.STAY || sourceAlarmMode === ElkAlarmPanelDevice_1.AlarmMode.STAY_INSTANT) {
                return plugin_1.Characteristic.SecuritySystemCurrentState.STAY_ARM;
            }
            else if (sourceAlarmMode === ElkAlarmPanelDevice_1.AlarmMode.AWAY || sourceAlarmMode === ElkAlarmPanelDevice_1.AlarmMode.VACATION) {
                return plugin_1.Characteristic.SecuritySystemCurrentState.AWAY_ARM;
            }
            else if (sourceAlarmMode === ElkAlarmPanelDevice_1.AlarmMode.NIGHT || sourceAlarmMode === ElkAlarmPanelDevice_1.AlarmMode.NIGHT_INSTANT) {
                return plugin_1.Characteristic.SecuritySystemCurrentState.NIGHT_ARM;
            }
            else {
                this.logger.info(`ALARMSYSTEM: ${this.device.name} Setting to disarmed because sourceAlarmMode is ${sourceAlarmMode}`);
                return plugin_1.Characteristic.SecuritySystemCurrentState.DISARMED;
            }
        }
    }
    // Translates the current target state of hthe underlying alarm into the appropriate homekit value
    translateAlarmTargetStateToHK() {
        const sourceAlarmState = this.device.getAlarmMode();
        if (sourceAlarmState === ElkAlarmPanelDevice_1.AlarmMode.STAY || sourceAlarmState === ElkAlarmPanelDevice_1.AlarmMode.STAY_INSTANT) {
            return plugin_1.Characteristic.SecuritySystemTargetState.STAY_ARM;
        }
        else if (sourceAlarmState === ElkAlarmPanelDevice_1.AlarmMode.AWAY || sourceAlarmState === ElkAlarmPanelDevice_1.AlarmMode.VACATION) {
            return plugin_1.Characteristic.SecuritySystemTargetState.AWAY_ARM;
        }
        else if (sourceAlarmState === ElkAlarmPanelDevice_1.AlarmMode.NIGHT || sourceAlarmState === ElkAlarmPanelDevice_1.AlarmMode.NIGHT_INSTANT) {
            return plugin_1.Characteristic.SecuritySystemTargetState.NIGHT_ARM;
        }
        else {
            return plugin_1.Characteristic.SecuritySystemTargetState.DISARM;
        }
    }
    // Translates the homekit version of the alarm target state into the appropriate elk alarm panel state
    translateHKToAlarmTargetState(state) {
        if (state === plugin_1.Characteristic.SecuritySystemTargetState.STAY_ARM) {
            return ElkAlarmPanelDevice_1.AlarmMode.STAY;
        }
        else if (state === plugin_1.Characteristic.SecuritySystemTargetState.AWAY_ARM) {
            return ElkAlarmPanelDevice_1.AlarmMode.AWAY;
        }
        else if (state === plugin_1.Characteristic.SecuritySystemTargetState.NIGHT_ARM) {
            return ElkAlarmPanelDevice_1.AlarmMode.NIGHT;
        }
        else {
            return ElkAlarmPanelDevice_1.AlarmMode.DISARMED;
        }
    }
    // Handles request to get the target alarm state
    getAlarmTargetState(callback) {
        callback(null, this.translateAlarmTargetStateToHK());
    }
    // Handles request to get the current alarm state
    getAlarmCurrentState(callback) {
        callback(null, this.translateAlarmCurrentStateToHK());
    }
    // Mirrors change in the state of the underlying isj-js device object.
    handlePropertyChange(propertyName, value, oldValue, formattedValue) {
        super.handlePropertyChange(propertyName, value, oldValue, formattedValue);
        this.info(`ALARMPANEL: ${this.device.name} Source device. Currenty state locally -${this.device.getAlarmStatusAsText()}`);
        this.info(`ALARMPANEL: ${this.device.name} Got alarm change notification. Setting HK target state to: ${this.translateAlarmTargetStateToHK()} Setting HK Current state to: ${this.translateAlarmCurrentStateToHK()}`);
        this.alarmPanelService.setCharacteristic(plugin_1.Characteristic.SecuritySystemTargetState, this.translateAlarmTargetStateToHK());
        this.alarmPanelService.setCharacteristic(plugin_1.Characteristic.SecuritySystemCurrentState, this.translateAlarmCurrentStateToHK());
    }
    // Returns the set of services supported by this object.
    setupServices() {
        super.setupServices();
        this.alarmPanelService = this.addService(plugin_1.Service.SecuritySystem);
        this.alarmPanelService.getCharacteristic(plugin_1.Characteristic.SecuritySystemTargetState).on('set', this.setAlarmTargetState.bind(this));
        this.alarmPanelService.getCharacteristic(plugin_1.Characteristic.SecuritySystemTargetState).on('get', this.getAlarmTargetState.bind(this));
        this.alarmPanelService.getCharacteristic(plugin_1.Characteristic.SecuritySystemCurrentState).on('get', this.getAlarmCurrentState.bind(this));
    }
}
exports.ISYElkAlarmPanelAccessory = ISYElkAlarmPanelAccessory;
//# sourceMappingURL=ISYElkAlarmPanelAccessory.js.map