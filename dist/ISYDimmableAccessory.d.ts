import { InsteonDimmableDevice } from 'isy-nodejs';
import { ISYPlatform } from './ISYPlatform';
import { ISYRelayAccessory } from './ISYRelayAccessory';
import './utils';
export declare class ISYDimmableAccessory<T extends InsteonDimmableDevice> extends ISYRelayAccessory<T> {
    constructor(device: T, platform: ISYPlatform);
    map(propertyName: keyof T, propertyValue: any): {
        characteristicValue: import("hap-nodejs").CharacteristicValue;
        characteristic?: import("hap-nodejs").WithUUID<new () => import("hap-nodejs").Characteristic>;
        service: import("hap-nodejs").Service;
    };
    handlePropertyChange(propertyName: string, value: any, oldValue: any, formattedValue: string): void;
    setupServices(): void;
}
//# sourceMappingURL=ISYDimmableAccessory.d.ts.map