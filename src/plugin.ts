
import * as HAPNodeJS from "hap-nodejs";
import * as HB from 'homebridge';
import { API, Characteristic as C, CharacteristicValue, PlatformAccessory as PA, Service as S, User as U } from 'homebridge';
import { HomebridgeAPI } from 'homebridge/lib/api';
import { ISYPlatform } from './ISYPlatform';
import './utils';
import { onGet, onSet } from './utils';

export const PluginName = 'homebridge-isy';
export const PlatformName = 'ISY';

export let PlatformAccessory: typeof PA;
export let Service: typeof S;
export let Characteristic: typeof C;
export let User: typeof U;
export let HAP: typeof HAPNodeJS;
export let generate: (data: any) => string;

export default (homebridge: API) => {

	PlatformAccessory = homebridge.platformAccessory;
	Service = homebridge.hap.Service;
	Characteristic = homebridge.hap.Characteristic;
	User = homebridge.user;
	HAP = homebridge.hap;
	generate = homebridge.hap.uuid.generate;

	PlatformAccessory.prototype.getOrAddService = function(service: HB.WithUUID<typeof Service>): HB.Service {
		const acc = this as unknown as HB.PlatformAccessory;
		const serv = acc.getService(service);
		if (!serv) {
			return acc.addService(service);
		}
		return serv;
	};

	((Characteristic as any).prototype).onGet = function(func: () => CharacteristicValue): HB.Characteristic {
			const c = this as unknown as HB.Characteristic;
			return onGet(c, func);

	};

	(Characteristic.prototype).onSet = function(func: (arg: CharacteristicValue) => Promise<any>): HB.Characteristic {
		const c = this as unknown as HB.Characteristic;
		return onSet(c, func);
	};
	// require('./utils');
	homebridge.registerPlatform(PluginName, PlatformName, ISYPlatform);
	return this;

};
