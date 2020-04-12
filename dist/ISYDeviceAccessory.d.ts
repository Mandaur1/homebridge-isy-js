import { Categories } from 'hap-nodejs';
import { InsteonBaseDevice } from 'isy-js';
import { ISYAccessory } from './ISYAccessory';
export declare class ISYDeviceAccessory<T extends InsteonBaseDevice, TCategory extends Categories> extends ISYAccessory<T, TCategory> {
    identify(): void;
}
