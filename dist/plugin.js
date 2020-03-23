// import { CharacteristicEventTypes, CharacteristicProps, CharacteristicValue, WithUUID } from 'hap-nodejs';
Object.defineProperty(exports, "__esModule", { value: true });
var ISYPlatform_1 = require("./ISYPlatform");
exports.default = (function (homebridge) {
    //const Service = homebridge.hap.Service;
    //const Hap = homebridge.hap;
    //onst Characteristic = homebridge.hap.Characteristic;
    //const api = homebridge;
    homebridge.registerPlatform("homebridge-isy-js", 'isy-js', ISYPlatform_1.ISYPlatform, null);
});
