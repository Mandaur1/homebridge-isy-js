import './utils';
import { Categories } from 'hap-nodejs';
import { ISYScene } from 'isy-nodejs';
import { ISYAccessory } from './ISYAccessory';
export declare class ISYSceneAccessory extends ISYAccessory<ISYScene, Categories.LIGHTBULB> {
    dimmable: boolean;
    scene: ISYScene;
    constructor(scene: ISYScene);
    identify(): void;
    handlePropertyChange(propertyName: string, value: any, oldValue: any, formattedValue: string): void;
    getPowerState(callback: (...any: any[]) => void): void;
    setupServices(): void;
}
//# sourceMappingURL=ISYSceneAccessory.d.ts.map