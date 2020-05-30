"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ISYFanAccessory = void 0;
require("./ISYPlatform");
const ISYDeviceAccessory_1 = require("./ISYDeviceAccessory");
const plugin_1 = require("./plugin");
class ISYFanAccessory extends ISYDeviceAccessory_1.ISYDeviceAccessory {
    constructor(device, platform) {
        super(device, platform);
        this.category = 3 /* FAN */;
    }
    map(propertyName, propertyValue) {
        if (propertyName === 'motor.ST') {
            return { characteristicValue: propertyValue, characteristic: plugin_1.Characteristic.RotationSpeed, service: this.fanService };
        }
        else if (propertyName === 'light.ST') {
            return { characteristicValue: propertyValue, characteristic: plugin_1.Characteristic.Brightness, service: this.lightService };
        }
    }
    handlePropertyChange(propertyName, value, oldValue, formattedValue) {
        super.handlePropertyChange(propertyName, value, oldValue, formattedValue);
        this.fanService.getCharacteristic(plugin_1.Characteristic.On).updateValue(this.device.motor.isOn);
        this.lightService.getCharacteristic(plugin_1.Characteristic.On).updateValue(this.device.light.isOn);
    }
    // Mirrors change in the state of the underlying isj-js device object.
    // Returns the services supported by the fan device.
    setupServices() {
        super.setupServices();
        const fanService = this.platformAccessory.getOrAddService(plugin_1.Service.Fan);
        this.fanService = fanService;
        const lightService = this.platformAccessory.getOrAddService(plugin_1.Service.Lightbulb);
        this.lightService = lightService;
        fanService.getCharacteristic(plugin_1.Characteristic.RotationSpeed).onSet(this.device.motor.updateFanSpeed.bind(this.device.motor)).onGet((() => this.device.motor.fanSpeed).bind(this)).setProps({
            minStep: 25,
            validValues: [0, 25, 75, 100]
        });
        fanService.getCharacteristic(plugin_1.Characteristic.On).onSet(this.device.motor.updateIsOn.bind(this.device.motor)).onGet((() => this.device.motor.isOn).bind(this));
        lightService.getCharacteristic(plugin_1.Characteristic.On).onSet(this.device.light.updateIsOn.bind(this.device.light)).onGet((() => this.device.light.isOn).bind(this));
        lightService.getCharacteristic(plugin_1.Characteristic.Brightness).onSet(this.device.light.updateBrightnessLevel.bind(this.device.light)).onGet((() => this.device.light.brightnessLevel).bind(this));
        fanService.isPrimaryService = true;
        this.primaryService = fanService;
    }
}
exports.ISYFanAccessory = ISYFanAccessory;
//# sourceMappingURL=ISYFanAccessory.js.map