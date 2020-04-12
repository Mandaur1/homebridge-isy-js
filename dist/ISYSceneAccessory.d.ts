import './utils';
import { Categories } from 'hap-nodejs';
import { ISYScene } from 'isy-js';
import { ISYAccessory } from './ISYAccessory';
export declare class ISYSceneAccessory extends ISYAccessory<ISYScene, Categories.LIGHTBULB> {
    dimmable: boolean;
    scene: ISYScene;
    constructor(scene: ISYScene);
    identify(): void;
    handleExternalChange(propertyName: string, value: any, formattedValue: string): void;
    getPowerState(callback: (...any: any[]) => void): void;
    setupServices(): void;
}
//# sourceMappingURL=ISYSceneAccessory.d.ts.map