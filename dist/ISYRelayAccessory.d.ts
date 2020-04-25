import { Categories, Characteristic, Service, WithUUID } from 'hap-nodejs';
import { InsteonRelayDevice } from 'isy-nodejs';
import { ISYDeviceAccessory } from './ISYDeviceAccessory';
import './utils';
export declare class ISYRelayAccessory<T extends InsteonRelayDevice> extends ISYDeviceAccessory<T, Categories.SWITCH | Categories.LIGHTBULB | Categories.OUTLET> {
    constructor(device: T);
    map(propertyName: keyof T, propertyValue: any): {
        characteristicValue: import("hap-nodejs").CharacteristicValue;
        characteristic?: WithUUID<new () => Characteristic>;
        service: Service;
    };
    setupServices(): void;
}
//# sourceMappingURL=ISYRelayAccessory.d.ts.map