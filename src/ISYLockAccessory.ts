import { Categories, CharacteristicEventTypes } from 'hap-nodejs';
import { InsteonLockDevice } from 'isy-nodejs';

import { ISYDeviceAccessory } from './ISYDeviceAccessory';
import { Characteristic, Service } from './plugin';

export class ISYLockAccessory extends ISYDeviceAccessory<InsteonLockDevice, Categories.DOOR_LOCK> {
	public lockService: any;

	// Handles an identify request

	// Handles a set to the target lock state. Will ignore redundant commands.
	public setTargetLockState(lockState: number, callback: (...any: any[]) => void) {
		this.info(`Sending command to set lock state to: ${lockState}`);
		if (lockState !== this.getDeviceCurrentStateAsHK()) {
			const targetLockValue = lockState === 0 ? false : true;
			this.device.sendLockCommand(targetLockValue, callback);

		} else {
			callback();
		}
	}
	// Translates underlying lock state into the corresponding homekit state
	public getDeviceCurrentStateAsHK() {
		return this.device.getCurrentLockState() ? 1 : 0;
	}
	// Handles request to get the current lock state for homekit
	public getLockCurrentState(callback) {
		callback(null, this.getDeviceCurrentStateAsHK());
	}
	// Handles request to get the target lock state for homekit
	public getTargetLockState(callback) {
		this.getLockCurrentState(callback);
	}
	// Mirrors change in the state of the underlying isy-nodejs device object.
	public handlePropertyChange(propertyName, value, oldValue, formattedValue) {
		this.lockService.updateCharacteristic(Characteristic.LockTargetState, this.getDeviceCurrentStateAsHK());
		this.lockService.updateCharacteristic(Characteristic.LockCurrentState, this.getDeviceCurrentStateAsHK());
	}
	// Returns the set of services supported by this object.
	public setupServices() {
		super.setupServices();
		const lockMechanismService = this.platformAccessory.getOrAddService(Service.LockMechanism);
		this.lockService = lockMechanismService;
		lockMechanismService.getCharacteristic(Characteristic.LockTargetState).on(CharacteristicEventTypes.SET, this.setTargetLockState.bind(this));
	
		lockMechanismService.getCharacteristic(Characteristic.LockCurrentState).on(CharacteristicEventTypes.GET, this.getLockCurrentState.bind(this));

	}
}
