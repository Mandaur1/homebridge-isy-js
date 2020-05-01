
import { Characteristic, CharacteristicEventTypes, CharacteristicProps, CharacteristicValue, Service, WithUUID } from 'hap-nodejs';
import { API, PlatformAccessory } from 'homebridge';

import { ISYAccessory } from './ISYAccessory';
import { ISYPlatform } from './ISYPlatform';

export const PluginName = 'homebridge-isy';
export const PlatformName = 'ISY';



export default (homebridge: API) => {

	PlatformAccessory.prototype.getOrAddService = function(service: WithUUID<typeof Service>): Service {
		const acc = this as unknown as PlatformAccessory;
		const serv = acc.getService(service);
		if (!serv) {
			return acc.addService(service);
		}
		return serv;

	};

	homebridge.registerPlatform(PluginName, PlatformName, ISYPlatform);
	return this;

};
