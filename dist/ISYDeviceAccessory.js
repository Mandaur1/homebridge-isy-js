"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ISYDeviceAccessory = void 0;
const ISYAccessory_1 = require("./ISYAccessory");
class ISYDeviceAccessory extends ISYAccessory_1.ISYAccessory {
    identify() {
        this.device.sendBeep(100);
    }
}
exports.ISYDeviceAccessory = ISYDeviceAccessory;
//# sourceMappingURL=ISYDeviceAccessory.js.map