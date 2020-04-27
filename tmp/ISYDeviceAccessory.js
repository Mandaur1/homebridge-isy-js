"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ISYAccessory_1 = require("./ISYAccessory");
class ISYDeviceAccessory extends ISYAccessory_1.ISYAccessory {
    identify() {
        this.device.sendBeep(100);
    }
}
exports.ISYDeviceAccessory = ISYDeviceAccessory;
//# sourceMappingURL=ISYDeviceAccessory.js.map