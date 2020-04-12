import './utils';
import { Categories, Characteristic, Service } from 'hap-nodejs';
import { InsteonRelayDevice } from 'isy-js';
import { ISYDeviceAccessory } from './ISYDeviceAccessory';
export declare class ISYRelayAccessory<T extends InsteonRelayDevice> extends ISYDeviceAccessory<T, Categories.SWITCH | Categories.LIGHTBULB | Categories.OUTLET> {
    constructor(device: T);
    map(propertyName: keyof T): {
        characteristic: typeof Characteristic;
        service: Service;
    };
    setupServices(): Service[];
}
