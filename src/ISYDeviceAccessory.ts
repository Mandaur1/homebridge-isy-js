import { Categories, TargetCategory } from 'hap-nodejs';
import { InsteonBaseDevice } from 'isy-js';

import { ISYAccessory } from './ISYAccessory';

export class ISYDeviceAccessory<T extends InsteonBaseDevice, TCategory extends Categories> extends ISYAccessory<T, TCategory> {



	public identify(callback: any) {
		this.device.sendBeep(100).then(() => callback);
	}
}
