import { Categories } from 'hap-nodejs';
import { InsteonRelayDevice } from 'isy-nodejs';
import { ISYAccessory } from './ISYAccessory';
export declare class ISYGarageDoorAccessory extends ISYAccessory<InsteonRelayDevice, Categories.GARAGE_DOOR_OPENER> {
    timeToOpen: any;
    relayDevice: any;
    alternate: any;
    targetGarageState: any;
    currentGarageState: any;
    garageDoorService: any;
    constructor(sensorDevice: any, relayDevice: any, name: any, timeToOpen: any, alternate: any, platform: any);
    getSensorState(): any;
    sendGarageDoorCommand(callback: any): void;
    setTargetDoorState(targetState: any, callback: any): void;
    getCurrentDoorState(callback: any): void;
    setCurrentDoorState(newState: any, callback: () => void): void;
    getTargetDoorState(callback: any): void;
    completeOpen(): void;
    handlePropertyChange(propertyName: any, value: any, oldValue: any, formattedValue: any): void;
    getObstructionState(callback: any): void;
    setupServices(): void;
}
//# sourceMappingURL=ISYGarageDoorAccessory.d.ts.map