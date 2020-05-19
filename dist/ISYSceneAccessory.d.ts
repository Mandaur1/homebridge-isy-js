import './utils';
import { ISYScene } from 'isy-nodejs';
import { Categories } from 'homebridge';
import { ISYAccessory } from './ISYAccessory';
export declare class ISYSceneAccessory extends ISYAccessory<ISYScene, Categories.LIGHTBULB> {
    dimmable: boolean;
    scene: ISYScene;
    constructor(scene: ISYScene, platform: any);
    identify(): void;
    handlePropertyChange(propertyName: string, value: any, oldValue: any, formattedValue: string): void;
    getPowerState(callback: (...any: any[]) => void): void;
    setupServices(): void;
}
//# sourceMappingURL=ISYSceneAccessory.d.ts.map