Object.defineProperty(exports, "__esModule", { value: true });
require("./utils");
const hap_nodejs_1 = require("hap-nodejs");
const ISYDeviceAccessory_1 = require("./ISYDeviceAccessory");
class ISYOutletAccessory extends ISYDeviceAccessory_1.ISYDeviceAccessory {
    constructor(device) {
        super(device);
        this.category = hap_nodejs_1.Categories.OUTLET;
    }
    // Handles the identify command
    // Handles a request to set the outlet state. Ignores redundant sets based on current states.
    setOutletState(outletState, callback) {
        this.log.info(`OUTLET: Sending command to set outlet state to: ${outletState}`);
        if (outletState !== this.device.isOn) {
            this.device
                .updateIsOn(outletState)
                .then(callback(true))
                .catch(callback(false));
        }
        else {
            callback();
        }
    }
    // Handles a request to get the current outlet state based on underlying isy-js device object.
    getOutletState(callback) {
        callback(null, this.device.isOn);
    }
    // Handles a request to get the current in use state of the outlet. We set this to true always as
    // there is no way to deterine this through the isy.
    getOutletInUseState(callback) {
        callback(null, true);
    }
    // Mirrors change in the state of the underlying isj-js device object.
    handleExternalChange(propertyName, value, formattedValue) {
        super.handleExternalChange(propertyName, value, formattedValue);
        this.outletService.updateCharacteristic(hap_nodejs_1.Characteristic.On, this.device.isOn);
    }
    // Returns the set of services supported by this object.
    setupServices() {
        super.setupServices();
        const outletService = this.platformAccessory.getOrAddService(hap_nodejs_1.Service.Outlet);
        this.outletService = outletService;
        outletService.getCharacteristic(hap_nodejs_1.Characteristic.On).onSet(this.bind(this.device.updateIsOn));
        outletService.getCharacteristic(hap_nodejs_1.Characteristic.On).onGet(() => this.device.isOn);
        outletService.getCharacteristic(hap_nodejs_1.Characteristic.OutletInUse).onGet(() => true);
        return [this.informationService, outletService];
    }
}
exports.ISYOutletAccessory = ISYOutletAccessory;
//# sourceMappingURL=ISYOutletAccessory.js.map