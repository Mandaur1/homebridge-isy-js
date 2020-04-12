import './utils';
import { Characteristic, Service } from 'hap-nodejs';
import { InsteonDimmableDevice } from 'isy-js';
import { ISYRelayAccessory } from './ISYRelayAccessory';
export declare class InsteonDimmableAccessory<T extends InsteonDimmableDevice> extends ISYRelayAccessory<T> {
    constructor(device: T);
    map(propertyName: keyof T): {
        characteristic: typeof Characteristic;
        service: Service;
    };
    handleExternalChange(propertyName: string, value: any, formattedValue: any): void;
    getBrightness(callback: (...any: any[]) => void): void;
    setupServices(): Service[];
}
