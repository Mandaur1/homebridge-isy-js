import { Characteristic, Service } from 'hap-nodejs';
import { InsteonDimmableDevice } from 'isy-nodejs';
import { ISYRelayAccessory } from './ISYRelayAccessory';
import './utils';
export declare class ISYDimmableAccessory<T extends InsteonDimmableDevice> extends ISYRelayAccessory<T> {
    constructor(device: T);
    map(propertyName: keyof T, propertyValue: any): {
        characteristicValue: import("hap-nodejs").CharacteristicValue;
        characteristic?: import("hap-nodejs").WithUUID<new () => Characteristic>;
        service: Service;
    };
    handlePropertyChange(propertyName: string, value: any, oldValue: any, formattedValue: any): void;
    getBrightness(callback: (...any: any[]) => void): void;
    setupServices(): void;
}
//# sourceMappingURL=ISYDimmerAccessory.d.ts.map