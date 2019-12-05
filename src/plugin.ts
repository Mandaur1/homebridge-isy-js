import { API } from 'homebridge';

import { ISYPlatform } from './ISYPlatform';

export let Service: HAPNodeJS.Service;

let CProps: HAPNodeJS.CharacteristicProps;
// tslint:disable-next-line:variable-name
export let Hap: HAPNodeJS.HAPNodeJS;
export let Characteristic: HAPNodeJS.Characteristic;
let IEventEmitterCharacteristic: HAPNodeJS.IEventEmitterCharacteristic;
export let UUIDGen: HAPNodeJS.uuid;

declare global {
	interface Promise<T> {
		handleWith(callback: (...any) => void);
	}

}

// tslint:disable-next-line: no-namespace

// tslint:disable-next-line: no-namespace

export function onSet<T>(characteristic: HAPNodeJS.IEventEmitterCharacteristic, func: (...args) => Promise<T>): HAPNodeJS.IEventEmitterCharacteristic {
					return characteristic.on('set', addCallback(func));
				}

Promise.prototype.handleWith = async function(callback: (...any) => void) {
	return this.then(() => {
		callback(false);
	}).catch((msg) => {
		callback(true);
	});
};

export function addCallback<T>(func: (...args) => Promise<T>): (...newArgs: any[]) => void {
	return (...newArgs: any[]) => {
		// assumption is function has signature of (args.... callback)
		const cback = newArgs.pop();
		if (cback instanceof Function) {
			return func(newArgs).handleWith(cback);
		} else {
			throw new Error('Last argument of callback is not a function.');
		}

	};

}

export default (homebridge: API) => {
	// Service = homebridge.hap.Service;

	UUIDGen = homebridge.hap.uuid;
	Hap = homebridge.hap;
	Service = Hap.Service;
	Characteristic = Hap.Characteristic;
	const api = homebridge;
	api.registerPlatform(`homebridge-isy-js`, 'isy-js', ISYPlatform);
};
