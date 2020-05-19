"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ISYOutletAccessory = exports.ISYOnOffOutletAccessory = void 0;
require("./utils");
const ISYDeviceAccessory_1 = require("./ISYDeviceAccessory");
const plugin_1 = require("./plugin");
class ISYOnOffOutletAccessory extends ISYDeviceAccessory_1.ISYDeviceAccessory {
    get outlet1Service() {
        var _a;
        if (!this.primaryService) {
            this.primaryService = (_a = this.platformAccessory) === null || _a === void 0 ? void 0 : _a.getOrAddService(plugin_1.Service.Outlet);
        }
        return this.primaryService;
    }
    get outlet2Service() {
        if (!this._outlet2Service) {
            this._outlet2Service = this.platformAccessory.addService(new plugin_1.Service.Outlet('Outlet 2', '2'));
        }
        return this._outlet2Service;
    }
    map(propertyName, propertyValue) {
        if (propertyName === 'outlet1.ST') {
            return { characteristicValue: propertyValue, characteristic: plugin_1.Characteristic.On, service: this.outlet1Service };
        }
        else if (propertyName === 'outlet2.ST') {
            return { characteristicValue: propertyValue, characteristic: plugin_1.Characteristic.On, service: this.outlet2Service };
        }
    }
    setupServices() {
        super.setupServices();
        this.outlet1Service.getCharacteristic(plugin_1.Characteristic.On).onSet((this.device.outlet1.updateIsOn).bind(this.device.outlet1));
        this.outlet1Service.getCharacteristic(plugin_1.Characteristic.On).onGet(() => this.outlet1.isOn);
        this.outlet1Service.getCharacteristic(plugin_1.Characteristic.OutletInUse).onGet(() => true);
        this.outlet2Service.getCharacteristic(plugin_1.Characteristic.On).onSet((this.device.outlet2.updateIsOn).bind(this.device.outlet2));
        this.outlet2Service.getCharacteristic(plugin_1.Characteristic.On).onGet(() => this.outlet2.isOn);
        this.outlet2Service.getCharacteristic(plugin_1.Characteristic.OutletInUse).onGet(() => true);
    }
}
exports.ISYOnOffOutletAccessory = ISYOnOffOutletAccessory;
class ISYOutletAccessory extends ISYDeviceAccessory_1.ISYDeviceAccessory {
    // Handles the identify command
    // Handles a request to set the outlet state. Ignores redundant sets based on current states.
    // Handles a request to get the current in use state of the outlet. We set this to true always as
    // there is no way to deterine this through the isy.
    // Mirrors change in the state of the underlying isj-js device object.
    handlePropertyChange(propertyName, value, oldValue, formattedValue) {
        super.handlePropertyChange(propertyName, value, oldValue, formattedValue);
        this.outletService.updateCharacteristic(plugin_1.Characteristic.On, this.device.isOn);
    }
    // Returns the set of services supported by this object.
    setupServices() {
        super.setupServices();
        const outletService = this.platformAccessory.getOrAddService(plugin_1.Service.Outlet);
        this.primaryService = outletService;
        outletService.getCharacteristic(plugin_1.Characteristic.On).onSet(this.bind(this.device.updateIsOn));
        outletService.getCharacteristic(plugin_1.Characteristic.On).onGet(() => this.device.isOn);
        outletService.getCharacteristic(plugin_1.Characteristic.OutletInUse).onGet(() => true); /*Insteon Outlets Do not report this*/
    }
}
exports.ISYOutletAccessory = ISYOutletAccessory;
//# sourceMappingURL=ISYOutletAccessory.js.map