Object.defineProperty(exports, "__esModule", { value: true });
require("./utils");
const hap_nodejs_1 = require("hap-nodejs");
const ISYDeviceAccessory_1 = require("./ISYDeviceAccessory");
class ISYDoorWindowSensorAccessory extends ISYDeviceAccessory_1.ISYDeviceAccessory {
    constructor(device) {
        super(device);
        this.doorWindowState = false;
    }
    // Handles the identify command.
    // Translates the state of the underlying device object into the corresponding homekit compatible state
    translateCurrentDoorWindowState() {
        return this.device.isOpen;
    }
    // Handles the request to get he current door window state.
    getCurrentDoorWindowState(callback) {
        callback(null, this.translateCurrentDoorWindowState());
    }
    // Mirrors change in the state of the underlying isj-js device object.
    handleExternalChange(propertyName, value, formattedValue) {
        super.handleExternalChange(propertyName, value, formattedValue);
        this.sensorService.getCharacteristic(hap_nodejs_1.Characteristic.CurrentDoorState).updateValue(!this.device.isOpen ? 1 : 0);
    }
    // Returns the set of services supported by this object.
    setupServices() {
        super.setupServices();
        const sensorService = this.platformAccessory.getOrAddService(hap_nodejs_1.Service.ContactSensor);
        this.sensorService = sensorService;
        sensorService.getCharacteristic(hap_nodejs_1.Characteristic.ContactSensorState).onGet(() => this.device.isOpen);
        return [this.informationService, sensorService];
    }
}
exports.ISYDoorWindowSensorAccessory = ISYDoorWindowSensorAccessory;
