import { Characteristic, Service } from 'hap-nodejs';
import { InsteonKeypadDimmerDevice } from 'isy-nodejs';
import './utils';
import { ISYDimmableAccessory } from './ISYDimmableAccessory';
export declare class ISYKeypadDimmerAccessory<T extends InsteonKeypadDimmerDevice> extends ISYDimmableAccessory<T> {
    constructor(device: T);
    map(propertyName: keyof T, propertyValue: any): {
        characteristicValue: import("hap-nodejs").CharacteristicValue;
        characteristic?: import("hap-nodejs").WithUUID<new () => Characteristic>;
        service: Service;
    };
    handleExternalChange(propertyName: string, value: any, formattedValue: any): void;
    getBrightness(callback: (...any: any[]) => void): void;
    setupServices(): void;
}
//# sourceMappingURL=ISYKeypadDimmerAccessory.d.ts.map