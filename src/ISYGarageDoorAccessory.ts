import { Categories, CharacteristicEventTypes } from 'hap-nodejs';
import { InsteonRelayDevice } from 'isy-nodejs';

import { ISYAccessory } from './ISYAccessory';
import { Characteristic, Service } from './plugin';

export class ISYGarageDoorAccessory extends ISYAccessory<InsteonRelayDevice, Categories.GARAGE_DOOR_OPENER> {
	public timeToOpen: any;
	public relayDevice: any;
	public alternate: any;
	public targetGarageState: any;
	public currentGarageState: any;
	public garageDoorService: any;

	constructor(sensorDevice, relayDevice, name, timeToOpen, alternate, platform) {
		super(sensorDevice, platform);
		this.timeToOpen = timeToOpen;
		this.relayDevice = relayDevice;
		this.alternate = alternate === undefined ? false : alternate;
		if (this.getSensorState()) {
			this.log.info(`GARAGE: ${this.name} Initial set during startup the sensor is open so defaulting states to open`);
			this.targetGarageState = Characteristic.TargetDoorState.OPEN;
			this.currentGarageState = Characteristic.CurrentDoorState.OPEN;
		} else {
			this.log.info(`GARAGE: ${this.name} Initial set during startup the sensor is closed so defaulting states to closed`);
			this.targetGarageState = Characteristic.TargetDoorState.CLOSED;
			this.currentGarageState = Characteristic.CurrentDoorState.CLOSED;
		}
	}
	public getSensorState() {
		if (this.alternate) {
			return !this.device.getCurrentDoorWindowState();
		} else {
			return this.device.getCurrentDoorWindowState();
		}
	}
	// Handles an identify request

	public sendGarageDoorCommand(callback) {
		this.relayDevice.sendLightCommand(true, function() {
			callback();
		});
	}
	// Handles a set to the target lock state. Will ignore redundant commands.
	public setTargetDoorState(targetState, callback) {
		const that = this;
		if (targetState === this.targetGarageState) {
			this.logger.info('GARAGE: Ignoring redundant set of target state');
			callback();
			return;
		}
		this.targetGarageState = targetState;
		if (this.currentGarageState === Characteristic.CurrentDoorState.OPEN) {
			if (targetState === Characteristic.TargetDoorState.CLOSED) {
				this.logger.info(`GARAGE: Current state is open and target is closed. Changing state to closing and sending command`);
				this.garageDoorService.setCharacteristic(Characteristic.CurrentDoorState, Characteristic.CurrentDoorState.CLOSING);
				this.sendGarageDoorCommand(callback);
			}
		} else if (this.currentGarageState === Characteristic.CurrentDoorState.CLOSED) {
			if (targetState === Characteristic.TargetDoorState.OPEN) {
				this.logger.info(`GARAGE: Current state is closed and target is open. Waiting for sensor change to trigger opening state`);
				this.sendGarageDoorCommand(callback);
				return;
			}
		} else if (this.currentGarageState === Characteristic.CurrentDoorState.OPENING) {
			if (targetState === Characteristic.TargetDoorState.CLOSED) {
				this.logger.info(`GARAGE: ${this.device.name} Current state is opening and target is closed. Sending command and changing state to closing`);
				this.garageDoorService.setCharacteristic(Characteristic.CurrentDoorState, Characteristic.CurrentDoorState.CLOSING);
				this.sendGarageDoorCommand(() => setTimeout(() => that.sendGarageDoorCommand(callback), 3000));
				return;
			}
		} else if (this.currentGarageState === Characteristic.CurrentDoorState.CLOSING) {
			if (targetState === Characteristic.TargetDoorState.OPEN) {
				this.logger.info(`GARAGE: ${this.device.name} Current state is closing and target is open. Sending command and setting timeout to complete`);
				this.garageDoorService.setCharacteristic(Characteristic.CurrentDoorState, Characteristic.CurrentDoorState.OPENING);
				this.sendGarageDoorCommand(() => {
					that.sendGarageDoorCommand(callback);
					setTimeout(that.completeOpen.bind(that), that.timeToOpen);
				});
			}
		}
	}
	// Handles request to get the current lock state for homekit
	public getCurrentDoorState(callback) {
		callback(null, this.currentGarageState);
	}
	public setCurrentDoorState(newState: any, callback: () => void) {
		this.currentGarageState = newState;
		callback();
	}
	// Handles request to get the target lock state for homekit
	public getTargetDoorState(callback) {
		callback(null, this.targetGarageState);
	}
	public completeOpen() {
		if (this.currentGarageState === Characteristic.CurrentDoorState.OPENING) {
			this.logger.info('Current door has bee opening long enough, marking open');
			this.garageDoorService.setCharacteristic(Characteristic.CurrentDoorState, Characteristic.CurrentDoorState.OPEN);
		} else {
			this.logger.info('Opening aborted so not setting opened state automatically');
		}
	}
	// Mirrors change in the state of the underlying isj-js device object.
	public handlePropertyChange(propertyName, value, oldValue, formattedValue) {
		super.handlePropertyChange(propertyName, value, oldValue, formattedValue);
		if (this.getSensorState()) {
			if (this.currentGarageState === Characteristic.CurrentDoorState.OPEN) {
				this.logger.info(`GARAGE:  ${this.device.name}Current state of door is open and now sensor matches. No action to take`);
			} else if (this.currentGarageState === Characteristic.CurrentDoorState.CLOSED) {
				this.logger.info(`GARAGE:  ${this.device.name}Current state of door is closed and now sensor says open. Setting state to opening`);
				this.garageDoorService.setCharacteristic(Characteristic.CurrentDoorState, Characteristic.CurrentDoorState.OPENING);
				this.targetGarageState = Characteristic.TargetDoorState.OPEN;
				this.garageDoorService.setCharacteristic(Characteristic.TargetDoorState, Characteristic.CurrentDoorState.OPEN);
				setTimeout(this.completeOpen.bind(this), this.timeToOpen);
			} else if (this.currentGarageState === Characteristic.CurrentDoorState.OPENING) {
				this.logger.info(`GARAGE:  ${this.device.name}Current state of door is opening and now sensor matches. No action to take`);
			} else if (this.currentGarageState === Characteristic.CurrentDoorState.CLOSING) {
				this.logger.info('GARAGE: C ' + this.device.name + 'Current state of door is closing and now sensor matches. No action to take');
			}
		} else {
			if (this.currentGarageState === Characteristic.CurrentDoorState.OPEN) {
				this.logger.info(`GARAGE:  ${this.device.name}Current state of door is open and now sensor shows closed. Setting current state to closed`);
				this.garageDoorService.setCharacteristic(Characteristic.CurrentDoorState, Characteristic.CurrentDoorState.CLOSED);
				this.targetGarageState = Characteristic.TargetDoorState.CLOSED;
				this.garageDoorService.setCharacteristic(Characteristic.TargetDoorState, Characteristic.TargetDoorState.CLOSED);
			} else if (this.currentGarageState === Characteristic.CurrentDoorState.CLOSED) {
				this.logger.info(`GARAGE:  ${this.device.name}Current state of door is closed and now sensor shows closed. No action to take`);
			} else if (this.currentGarageState === Characteristic.CurrentDoorState.OPENING) {
				this.logger.info(`GARAGE:  ${this.device.name} Current state of door is opening and now sensor shows closed. Setting current state to closed`);
				this.garageDoorService.setCharacteristic(Characteristic.CurrentDoorState, Characteristic.CurrentDoorState.CLOSED);
				this.targetGarageState = Characteristic.TargetDoorState.CLOSED;
				this.garageDoorService.setCharacteristic(Characteristic.TargetDoorState, Characteristic.TargetDoorState.CLOSED);
			} else if (this.currentGarageState === Characteristic.CurrentDoorState.CLOSING) {
				this.logger.info(`GARAGE:  ${this.device.name}Current state of door is closing and now sensor shows closed. Setting current state to closed`);
				this.garageDoorService.setCharacteristic(Characteristic.CurrentDoorState, Characteristic.CurrentDoorState.CLOSED);
				this.targetGarageState = Characteristic.TargetDoorState.CLOSED;
				this.garageDoorService.setCharacteristic(Characteristic.TargetDoorState, Characteristic.TargetDoorState.CLOSED);
			}
		}
	}
	public getObstructionState(callback) {
		callback(null, false);
	}
	// Returns the set of services supported by this object.
	public setupServices() {
		super.setupServices();
		const garageDoorService = this.platformAccessory.getOrAddService(Service.GarageDoorOpener);
		this.garageDoorService = garageDoorService;
		garageDoorService.getCharacteristic(Characteristic.TargetDoorState).on(CharacteristicEventTypes.SET, this.setTargetDoorState.bind(this));
		garageDoorService.getCharacteristic(Characteristic.TargetDoorState).on(CharacteristicEventTypes.GET, this.getTargetDoorState.bind(this));
		garageDoorService.getCharacteristic(Characteristic.CurrentDoorState).on(CharacteristicEventTypes.GET, this.getCurrentDoorState.bind(this));
		garageDoorService.getCharacteristic(Characteristic.CurrentDoorState).on(CharacteristicEventTypes.SET, this.setCurrentDoorState.bind(this));
		garageDoorService.getCharacteristic(Characteristic.ObstructionDetected).on(CharacteristicEventTypes.GET, this.getObstructionState.bind(this));

	}
}
