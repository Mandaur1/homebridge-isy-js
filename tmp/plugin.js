"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const homebridge_1 = require("homebridge");
const ISYPlatform_1 = require("./ISYPlatform");
exports.PluginName = 'homebridge-isy';
exports.PlatformName = 'ISY';
exports.default = (homebridge) => {
    homebridge_1.PlatformAccessory.prototype.getOrAddService = function (service) {
        const acc = this;
        const serv = acc.getService(service);
        if (!serv) {
            return acc.addService(service);
        }
        return serv;
    };
    homebridge.registerPlatform(exports.PluginName, exports.PlatformName, ISYPlatform_1.ISYPlatform);
    return this;
};
//# sourceMappingURL=plugin.js.map