import { Categories, Characteristic, CharacteristicValue, Service, WithUUID } from 'hap-nodejs';
import { Logger } from 'homebridge/lib/logger';
import { PlatformAccessory } from 'homebridge/lib/platformAccessory';
import { ISYNode } from 'isy-nodejs';
export declare class AccessoryContext {
    address: string;
}
export declare class ISYAccessory<T extends ISYNode, TCategory extends Categories> {
    [x: string]: any;
    logger: Logger;
    device: T;
    address: any;
    UUID: string;
    informationService: Service;
    name: string;
    displayName: string;
    platformAccessory: PlatformAccessory;
    category: TCategory;
    primaryService: Service;
    bind<TFunction extends Function>(func: TFunction): TFunction;
    constructor(device: T);
    map(propertyName: keyof T, propertyValue: any): {
        characteristicValue: CharacteristicValue;
        characteristic?: WithUUID<new () => Characteristic>;
        service: Service;
    };
    handleControlTrigger(controlName: string): void;
    configure(accessory?: PlatformAccessory): void;
    setupServices(): void;
    handlePropertyChange(propertyName: string, value: any, oldValue: any, formattedValue: string): void;
    updateCharacteristicValue(value: CharacteristicValue, characteristic: WithUUID<new () => Characteristic>, service: Service): void;
    convertToHK(propertyName: string, value: any): any;
    identify(): void;
}
//# sourceMappingURL=ISYAccessory.d.ts.map