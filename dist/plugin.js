"use strict";
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var ISYPlatform_1 = require("./ISYPlatform");
exports.default = (function (homebridge) {
    //const Service = homebridge.hap.Service;
    //const Hap = homebridge.hap;
    //const Characteristic = homebridge.hap.Characteristic;
    var PlatformAccessory = homebridge.platformAccessory;
    var api = homebridge;
    homebridge.registerPlatform("homebridge-isy-js", 'isy-js', ISYPlatform_1.ISYPlatform, true);
    return _this;
});
