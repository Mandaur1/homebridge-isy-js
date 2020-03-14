"use strict";
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
Object.defineProperty(exports, "__esModule", { value: true });
var isy_js_1 = require("isy-js");
var ISYDimmerAccessory_1 = require("./ISYDimmerAccessory");
var ISYDoorWindowSensorAccessory_1 = require("./ISYDoorWindowSensorAccessory");
var ISYElkAlarmPanelAccessory_1 = require("./ISYElkAlarmPanelAccessory");
var ISYFanAccessory_1 = require("./ISYFanAccessory");
var ISYGarageDoorAccessory_1 = require("./ISYGarageDoorAccessory");
var ISYLockAccessory_1 = require("./ISYLockAccessory");
var ISYMotionSensorAccessory_1 = require("./ISYMotionSensorAccessory");
var ISYOutletAccessory_1 = require("./ISYOutletAccessory");
var ISYRelayAccessory_1 = require("./ISYRelayAccessory");
var ISYSceneAccessory_1 = require("./ISYSceneAccessory");
var ISYThermostatAccessory_1 = require("./ISYThermostatAccessory");
// tslint:disable-next-line: ordered-imports
var ISYPlatform = /** @class */ (function () {
    function ISYPlatform(log, config, homebridge) {
        this.log = log;
        this.config = config;
        this.host = config.host;
        this.username = config.username;
        this.password = config.password;
        this.elkEnabled = config.elkEnabled;
        this.debugLoggingEnabled = config.debugLoggingEnabled === undefined ? false : config.debugLoggingEnabled;
        this.includeAllScenes = config.includeAllScenes === undefined ? false : config.includeAllScenes;
        this.includedScenes = config.includedScenes === undefined ? [] : config.includedScenes;
        this.ignoreRules = config.ignoreDevices;
        this.homebridge = homebridge;
        this.isy = new isy_js_1.ISY(this.host, this.username, this.password, config.elkEnabled, null, config.useHttps, true, this.debugLoggingEnabled, null, log);
    }
    ISYPlatform.prototype.logger = function (msg) {
        if (this.debugLoggingEnabled || (process.env.ISYJSDEBUG !== undefined && process.env.IYJSDEBUG !== null)) {
            // var timeStamp = new Date();
            this.log("Platform: " + msg);
        }
    };
    // Checks the device against the configuration to see if it should be ignored.
    ISYPlatform.prototype.shouldIgnore = function (device) {
        var e_1, _a, e_2, _b;
        var deviceAddress = device.address;
        var returnValue = true;
        if (device instanceof isy_js_1.ISYScene && this.includeAllScenes === false) {
            try {
                for (var _c = __values(this.includedScenes), _d = _c.next(); !_d.done; _d = _c.next()) {
                    var sceneAddress = _d.value;
                    if (sceneAddress === deviceAddress) {
                        return false;
                    }
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
                }
                finally { if (e_1) throw e_1.error; }
            }
        }
        if (this.config.ignoreDevices === undefined) {
            return false;
        }
        if (this.includeAllScenes || device instanceof isy_js_1.ISYDevice) {
            var deviceName = device.name;
            try {
                for (var _e = __values(this.ignoreRules), _f = _e.next(); !_f.done; _f = _e.next()) {
                    var rule = _f.value;
                    if (rule.nameContains !== undefined && rule.nameContains !== '') {
                        if (deviceName.indexOf(rule.nameContains) === -1) {
                            continue;
                        }
                    }
                    if (rule.lastAddressDigit !== undefined && rule.lastAddressDigit !== null) {
                        if (deviceAddress.indexOf(String(rule.lastAddressDigit), deviceAddress.length - 2) === -1) {
                            continue;
                        }
                    }
                    if (rule.address !== undefined && rule.address !== '') {
                        if (deviceAddress !== rule.address) {
                            continue;
                        }
                    }
                    if (rule.nodeDef !== undefined) {
                        if (device.nodeDefId !== rule.nodeDef) {
                            continue;
                        }
                    }
                    if (rule.folder !== undefined) {
                        if (device.folder !== rule.folder) {
                            continue;
                        }
                    }
                    this.logger("Ignoring device: " + deviceName + " (" + deviceAddress + ") because of rule: " + JSON.stringify(rule));
                    return true;
                }
            }
            catch (e_2_1) { e_2 = { error: e_2_1 }; }
            finally {
                try {
                    if (_f && !_f.done && (_b = _e.return)) _b.call(_e);
                }
                finally { if (e_2) throw e_2.error; }
            }
        }
        return false;
    };
    ISYPlatform.prototype.getGarageEntry = function (address) {
        var garageDoorList = this.config.garageDoors;
        if (garageDoorList !== undefined) {
            for (var index = 0; index < garageDoorList.length; index++) {
                var garageEntry = garageDoorList[index];
                if (garageEntry.address === address) {
                    return garageEntry;
                }
            }
        }
        return null;
    };
    ISYPlatform.prototype.renameDeviceIfNeeded = function (device) {
        var e_3, _a, e_4, _b, e_5, _c;
        var deviceAddress = device.address;
        var deviceName = device.name;
        //if (this.config.renameDevices === undefined) {
        //return deviceName;
        //}
        if (this.config.transformNames !== undefined) {
            if (this.config.transformNames.remove !== undefined)
                try {
                    for (var _d = __values(this.config.transformNames.remove), _e = _d.next(); !_e.done; _e = _d.next()) {
                        var removeText = _e.value;
                        deviceName.replace(removeText, '');
                    }
                }
                catch (e_3_1) { e_3 = { error: e_3_1 }; }
                finally {
                    try {
                        if (_e && !_e.done && (_a = _d.return)) _a.call(_d);
                    }
                    finally { if (e_3) throw e_3.error; }
                }
            if (this.config.transformNames.replace !== undefined)
                try {
                    for (var _f = __values(this.config.transformNames.replace), _g = _f.next(); !_g.done; _g = _f.next()) {
                        var replaceRule = _g.value;
                        deviceName.replace(replaceRule.replace, replaceRule.with);
                    }
                }
                catch (e_4_1) { e_4 = { error: e_4_1 }; }
                finally {
                    try {
                        if (_g && !_g.done && (_b = _f.return)) _b.call(_f);
                    }
                    finally { if (e_4) throw e_4.error; }
                }
        }
        if (this.config.renameDevices !== undefined) {
            try {
                for (var _h = __values(this.config.renameDevices), _j = _h.next(); !_j.done; _j = _h.next()) {
                    var rule = _j.value;
                    if (rule.name !== undefined && rule.name !== '') {
                        if (deviceName.indexOf(rule.name) === -1) {
                            continue;
                        }
                    }
                    if (rule.address !== undefined && rule.address !== '') {
                        if (deviceAddress !== rule.address) {
                            continue;
                        }
                    }
                    if (rule.newName === undefined) {
                        this.logger("Rule to rename device is present but no new name specified. Impacting device: " + deviceName);
                        return deviceName;
                    }
                    else {
                        this.logger("Renaming device: " + deviceName + "[" + deviceAddress + "] to [" + rule.newName + "] because of rule [" + rule.name + "] [" + rule.newName + "] [" + rule.address + "]");
                        return rule.newName;
                    }
                }
            }
            catch (e_5_1) { e_5 = { error: e_5_1 }; }
            finally {
                try {
                    if (_j && !_j.done && (_c = _h.return)) _c.call(_h);
                }
                finally { if (e_5) throw e_5.error; }
            }
        }
        return deviceName;
    };
    // Calls the isy-js library, retrieves the list of devices, and maps them to appropriate ISYXXXXAccessory devices.
    ISYPlatform.prototype.accessories = function (callback) {
        var _this = this;
        var that = this;
        this.isy.initialize(function () {
            var e_6, _a, e_7, _b;
            var results = [];
            var deviceList = _this.isy.deviceList;
            try {
                for (var _c = __values(deviceList.values()), _d = _c.next(); !_d.done; _d = _c.next()) {
                    var device = _d.value;
                    var homeKitDevice = null;
                    var garageInfo = that.getGarageEntry(device.address);
                    if (!that.shouldIgnore(device)) {
                        if (results.length >= 100) {
                            that.logger('Skipping any further devices as 100 limit has been reached');
                            break;
                        }
                        device.name = that.renameDeviceIfNeeded(device);
                        if (garageInfo !== null) {
                            var relayAddress = device.address.substr(0, device.address.length - 1);
                            relayAddress += "2";
                            var relayDevice = that.isy.getDevice(relayAddress);
                            homeKitDevice = new ISYGarageDoorAccessory_1.ISYGarageDoorAccessory(that.logger.bind(that), device, relayDevice, garageInfo.name, garageInfo.timeToOpen, garageInfo.alternate);
                        }
                        else {
                            homeKitDevice = that.createAccessory(device);
                        }
                        if (homeKitDevice !== null) {
                            // Make sure the device is address to the global map
                            // deviceMap[device.address] = homeKitDevice;
                            results.push(homeKitDevice);
                        }
                    }
                }
            }
            catch (e_6_1) { e_6 = { error: e_6_1 }; }
            finally {
                try {
                    if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
                }
                finally { if (e_6) throw e_6.error; }
            }
            try {
                for (var _e = __values(_this.isy.sceneList.values()), _f = _e.next(); !_f.done; _f = _e.next()) {
                    var scene = _f.value;
                    if (!_this.shouldIgnore(scene)) {
                        results.push(new ISYSceneAccessory_1.ISYSceneAccessory(_this.logger.bind(_this), scene));
                    }
                }
            }
            catch (e_7_1) { e_7 = { error: e_7_1 }; }
            finally {
                try {
                    if (_f && !_f.done && (_b = _e.return)) _b.call(_e);
                }
                finally { if (e_7) throw e_7.error; }
            }
            if (that.isy.elkEnabled) {
                if (results.length >= 100) {
                    that.logger('Skipping adding Elk Alarm panel as device count already at maximum');
                }
                else {
                    var panelDevice = that.isy.getElkAlarmPanel();
                    panelDevice.name = that.renameDeviceIfNeeded(panelDevice);
                    var panelDeviceHK = new ISYElkAlarmPanelAccessory_1.ISYElkAlarmPanelAccessory(that.log, panelDevice);
                    // deviceMap[panelDevice.address] = panelDeviceHK;
                    results.push(panelDeviceHK);
                }
            }
            that.logger("Filtered device list has: " + results.length + " devices");
            callback(results);
        });
    };
    ISYPlatform.prototype.createAccessory = function (device) {
        if (device instanceof isy_js_1.InsteonDimmableDevice) {
            return new ISYDimmerAccessory_1.InsteonDimmableAccessory(this.logger.bind(this), device);
        }
        else if (device instanceof isy_js_1.InsteonRelayDevice) {
            return new ISYRelayAccessory_1.ISYRelayAccessory(this.logger.bind(this), device);
        }
        else if (device instanceof isy_js_1.InsteonLockDevice) {
            return new ISYLockAccessory_1.ISYLockAccessory(this.logger.bind(this), device);
        }
        else if (device instanceof isy_js_1.InsteonOutletDevice) {
            return new ISYOutletAccessory_1.ISYOutletAccessory(this.logger.bind(this), device);
        }
        else if (device instanceof isy_js_1.InsteonFanDevice) {
            return new ISYFanAccessory_1.ISYFanAccessory(this.logger.bind(this), device);
        }
        else if (device instanceof isy_js_1.InsteonDoorWindowSensorDevice) {
            return new ISYDoorWindowSensorAccessory_1.ISYDoorWindowSensorAccessory(this.logger.bind(this), device);
        }
        else if (device instanceof isy_js_1.ElkAlarmSensorDevice) {
            return new ISYElkAlarmPanelAccessory_1.ISYElkAlarmPanelAccessory(this.logger.bind(this), device);
        }
        else if (device instanceof isy_js_1.InsteonMotionSensorDevice) {
            return new ISYMotionSensorAccessory_1.ISYMotionSensorAccessory(this.logger.bind(this), device);
        }
        else if (device instanceof isy_js_1.InsteonThermostatDevice) {
            return new ISYThermostatAccessory_1.ISYThermostatAccessory(this.logger.bind(this), device);
        }
        return null;
    };
    return ISYPlatform;
}());
exports.ISYPlatform = ISYPlatform;
