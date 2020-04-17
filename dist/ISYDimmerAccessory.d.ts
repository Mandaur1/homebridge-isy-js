import { Characteristic, Service } from 'hap-nodejs';
import { InsteonDimmableDevice } from 'isy-nodejs';
import { ISYRelayAccessory } from './ISYRelayAccessory';
import './utils';
export declare class InsteonDimmableAccessory<T extends InsteonDimmableDevice> extends ISYRelayAccessory<T> {
    constructor(device: T);
    map(propertyName: keyof T): {
        characteristic: typeof Characteristic;
        service: Service;
    };
    handleExternalChange(propertyName: string, value: any, formattedValue: any): void;
    getBrightness(callback: (...any: any[]) => void): void;
    setupServices(): void;
}
//# sourceMappingURL=ISYDimmerAccessory.d.ts.map