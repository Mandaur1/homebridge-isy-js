import { Characteristic, CharacteristicEventTypes, CharacteristicProps, CharacteristicValue, Service, WithUUID } from 'hap-nodejs';
import { API } from 'homebridge';
import { PlatformAccessory } from 'homebridge/lib/platformAccessory';
import { ISYAccessory } from 'ISYAccessory';

import { ISYPlatform } from './ISYPlatform';




export const PluginName = 'homebridge-isy'
export const PlatformName = 'ISY'

export let platformAccessory : typeof PlatformAccessory;

export default (homebridge: API) => {

	//Characteristic.prototype.onSet = function
	//const Hap = homebridge.hap;

	//const Characteristic = homebridge.hap.Characteristic;
	PlatformAccessory.prototype.getOrAddService = function (service: WithUUID<typeof Service>): Service {
		const acc = this as unknown as PlatformAccessory;
		const serv = acc.getService(service);
		if (!serv) {
			return acc.addService(service);
		}
		return serv;

	};

	homebridge.registerPlatform(PluginName, PlatformName, ISYPlatform,true);
	return this;

};
