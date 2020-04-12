Object.defineProperty(exports, "__esModule", { value: true });
const hap_nodejs_1 = require("hap-nodejs");
const ISYDeviceAccessory_1 = require("./ISYDeviceAccessory");
class ISYLockAccessory extends ISYDeviceAccessory_1.ISYDeviceAccessory {
    constructor(device) {
        super(device);
    }
    // Handles an identify request
    // Handles a set to the target lock state. Will ignore redundant commands.
    setTargetLockState(lockState, callback) {
        this.info(`Sending command to set lock state to: ${lockState}`);
        if (lockState !== this.getDeviceCurrentStateAsHK()) {
            const targetLockValue = lockState === 0 ? false : true;
            this.device.sendLockCommand(targetLockValue, callback);
        }
        else {
            callback();
        }
    }
    // Translates underlying lock state into the corresponding homekit state
    getDeviceCurrentStateAsHK() {
        return this.device.getCurrentLockState() ? 1 : 0;
    }
    // Handles request to get the current lock state for homekit
    getLockCurrentState(callback) {
        callback(null, this.getDeviceCurrentStateAsHK());
    }
    // Handles request to get the target lock state for homekit
    getTargetLockState(callback) {
        this.getLockCurrentState(callback);
    }
    // Mirrors change in the state of the underlying isy-js device object.
    handleExternalChange(propertyName, value, formattedValue) {
        this.lockService.updateCharacteristic(hap_nodejs_1.Characteristic.LockTargetState, this.getDeviceCurrentStateAsHK());
        this.lockService.updateCharacteristic(hap_nodejs_1.Characteristic.LockCurrentState, this.getDeviceCurrentStateAsHK());
    }
    // Returns the set of services supported by this object.
    setupServices() {
        super.setupServices();
        const lockMechanismService = this.platformAccessory.getOrAddService(hap_nodejs_1.Service.LockMechanism);
        this.lockService = lockMechanismService;
        lockMechanismService.getCharacteristic(hap_nodejs_1.Characteristic.LockTargetState).on(hap_nodejs_1.CharacteristicEventTypes.SET, this.setTargetLockState.bind(this));
        lockMechanismService.getCharacteristic(hap_nodejs_1.Characteristic.LockTargetState).on(hap_nodejs_1.CharacteristicEventTypes.GET, this.getTargetLockState.bind(this));
        lockMechanismService.getCharacteristic(hap_nodejs_1.Characteristic.LockCurrentState).on(hap_nodejs_1.CharacteristicEventTypes.GET, this.getLockCurrentState.bind(this));
        return [this.informationService, lockMechanismService];
    }
}
exports.ISYLockAccessory = ISYLockAccessory;
//# sourceMappingURL=ISYLockAccessory.js.map