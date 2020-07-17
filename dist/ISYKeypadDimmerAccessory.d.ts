import { InsteonKeypadDimmerDevice } from 'isy-nodejs';
import { ISYDimmableAccessory } from './ISYDimmableAccessory';
import './utils';
import { ISYPlatform } from './ISYPlatform';
export declare class ISYKeypadDimmerAccessory<T extends InsteonKeypadDimmerDevice> extends ISYDimmableAccessory<T> {
    constructor(device: T, platform: ISYPlatform);
    map(propertyName: keyof T, propertyValue: any): {
        characteristicValue: import("hap-nodejs").CharacteristicValue;
        characteristic?: import("hap-nodejs").WithUUID<new () => import("hap-nodejs").Characteristic>;
        service: import("hap-nodejs").Service;
    };
    setupServices(): void;
}
//# sourceMappingURL=ISYKeypadDimmerAccessory.d.ts.map