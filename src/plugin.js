"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ISYPlatform_1 = require("./ISYPlatform");
let CProps;
let IEventEmitterCharacteristic;
// tslint:disable-next-line: no-namespace
// tslint:disable-next-line: no-namespace
function onSet(characteristic, func) {
    return characteristic.on('set', addCallback(func));
}
exports.onSet = onSet;
Promise.prototype.handleWith = async function (callback) {
    return this.then(() => {
        callback(false);
    }).catch((msg) => {
        callback(true);
    });
};
function addCallback(func) {
    return (...newArgs) => {
        // assumption is function has signature of (args.... callback)
        const cback = newArgs.pop();
        if (cback instanceof Function) {
            return func(newArgs).handleWith(cback);
        }
        else {
            throw new Error('Last argument of callback is not a function.');
        }
    };
}
exports.addCallback = addCallback;
exports.default = (homebridge) => {
    // Service = homebridge.hap.Service;
    exports.UUIDGen = homebridge.hap.uuid;
    exports.Hap = homebridge.hap;
    exports.Service = exports.Hap.Service;
    exports.Characteristic = exports.Hap.Characteristic;
    const api = homebridge;
    api.registerPlatform(`homebridge-isy-js`, 'isy-js', ISYPlatform_1.ISYPlatform);
};
