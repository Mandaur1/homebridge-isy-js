Object.defineProperty(exports, "__esModule", { value: true });
const hap_nodejs_1 = require("hap-nodejs");
const HomeKit_1 = require("hap-nodejs/dist/lib/gen/HomeKit");
const ISYDeviceAccessory_1 = require("./ISYDeviceAccessory");
const utils_1 = require("./utils");
class ISYMotionSensorAccessory extends ISYDeviceAccessory_1.ISYDeviceAccessory {
    get motionSensorService() {
        var _a;
        return (_a = this.platformAccessory) === null || _a === void 0 ? void 0 : _a.getOrAddService(HomeKit_1.MotionSensor);
    }
    get lightSensorService() {
        var _a;
        return (_a = this.platformAccessory) === null || _a === void 0 ? void 0 : _a.getOrAddService(HomeKit_1.LightSensor);
    }
    get batteryLevelService() {
        var _a;
        return (_a = this.platformAccessory) === null || _a === void 0 ? void 0 : _a.getOrAddService(hap_nodejs_1.Service.BatteryService);
    }
    get temperatureSensorService() {
        var _a;
        return (_a = this.platformAccessory) === null || _a === void 0 ? void 0 : _a.getOrAddService(hap_nodejs_1.Service.TemperatureSensor);
    }
    constructor(device) {
        super(device);
        this.category = hap_nodejs_1.Categories.SENSOR;
    }
    map(propertyName) {
        switch (propertyName) {
            case 'CLITEMP':
                return { characteristic: hap_nodejs_1.Characteristic.CurrentTemperature, service: this.temperatureSensorService };
            case 'BATLVL':
                return { characteristic: hap_nodejs_1.Characteristic.BatteryLevel, service: this.batteryLevelService };
            case 'ST':
                return { characteristic: hap_nodejs_1.Characteristic.Active, service: this.informationService };
            case 'LUMIN':
                return { characteristic: hap_nodejs_1.Characteristic.CurrentTemperature, service: this.lightSensorService };
            case 'motionDetected':
                return { characteristic: hap_nodejs_1.Characteristic.MotionDetected, service: this.motionSensorService };
        }
        return null;
    }
    // Handles the identify command.
    // Handles the request to get he current motion sensor state.
    getCurrentMotionSensorState(callback) {
        callback(null, this.device.isMotionDetected);
    }
    // Mirrors change in the state of the underlying isj-js device object.
    /*ublic handleExternalChange(propertyName: string, value: any, formattedValue: string) {
        super.handleExternalChange(propertyName, value, formattedValue);

        this.sensorService.getCharacteristic(Characteristic.MotionDetected).updateValue(this.device.isMotionDetected);
    }
    // Returns the set of services supported by this object.
    var undefined = sensorService;
*/
    setupServices() {
        super.setupServices();
        this.motionSensorService.getCharacteristic(hap_nodejs_1.Characteristic.MotionDetected).onGet(() => this.device.isMotionDetected);
        this.temperatureSensorService.getCharacteristic(hap_nodejs_1.Characteristic.CurrentTemperature).onGet(() => utils_1.toCelsius(this.device.CLITEMP));
        this.batteryLevelService.getCharacteristic(hap_nodejs_1.Characteristic.BatteryLevel).onGet(() => this.device.BATLVL);
        this.lightSensorService.getCharacteristic(hap_nodejs_1.Characteristic.CurrentAmbientLightLevel).onGet(() => this.device.LUMIN);
        return [this.informationService, this.sensorService];
    }
}
exports.ISYMotionSensorAccessory = ISYMotionSensorAccessory;
