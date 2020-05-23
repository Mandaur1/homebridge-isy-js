import './utils';
import { ISYScene } from 'isy-nodejs';
import { Categories } from 'homebridge';
import { ISYAccessory } from './ISYAccessory';
export declare class ISYSceneAccessory extends ISYAccessory<ISYScene, Categories.LIGHTBULB> {
    dimmable: boolean;
    constructor(scene: ISYScene, platform: any);
    identify(): void;
    handlePropertyChange(propertyName: string, value: any, oldValue: any, formattedValue: string): void;
    setupServices(): void;
}
//# sourceMappingURL=ISYSceneAccessory.d.ts.map