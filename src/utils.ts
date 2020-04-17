import * as log4js from '@log4js-node/log4js-api';
import { CharacteristicEventTypes, CharacteristicGetCallback, CharacteristicSetCallback, CharacteristicValue, Service, WithUUID } from 'hap-nodejs';
import { Characteristic } from 'hap-nodejs/dist/lib/Characteristic';
import { Logger, Logging } from 'homebridge/lib/logger';
import { PlatformAccessory } from 'homebridge/lib/platformAccessory';

// import * as service from 'homebridge/node_modules/homebridge/node_modules/hap-nodejs/dist/lib/Service';

export const didFinishLaunching: symbol = Symbol('didFinishLaunching');

export let Hap;

declare global {
	interface Promise<T> {
		handleWith(callback: (...arg: any) => void): Promise<void>;
	}
}

// tslint:disable-next-line: no-namespace

// tslint:disable-next-line: no-namespace

export function onSet<T extends CharacteristicValue>(character: Characteristic, func: (arg: T) => Promise<any>): Characteristic {

	const cfunc = addSetCallback(func);

	return character.on(CharacteristicEventTypes.SET, cfunc);
}

export function toCelsius(temp: number): any {
	return ((temp - 32.0) * 5.0) / 9.0;
}
export function toFahrenheit(temp: number): any {
	return Math.round((temp * 9.0) / 5.0 + 32.0);
}

// export function onGetAsync<T>(character: characteristic.Characteristic, func: (arg: CharacteristicValue) => Promise<T>): characteristic.Characteristic {

// 	const cfunc = addGetCallback(func)

// 	return character.on(CharacteristicEventTypes.GET, cfunc);
// }

export function onGet<T extends CharacteristicValue>(character: Characteristic, func: () => T): Characteristic {

	const cfunc = (cb: CharacteristicGetCallback) => {
		cb(null, func());
	};

	return character.on(CharacteristicEventTypes.GET, cfunc);
}

// declare module 'homebridge/node_modules/homebridge/node_modules/hap-nodejs/dist/lib/Service' {

// 	export interface Service {

// 		updateCharacteristic<T extends WithUUID<typeof characteristic.Characteristic>>(name: T, value: CharacteristicValue): void;

// 	}

// }

export interface LoggerLike extends Partial<log4js.Logger> {
	prefix?: string;
	(msg: any): void;
	default(msg: any): void;

}

declare module 'homebridge/lib/platformAccessory' {
	export interface PlatformAccessory {
		getOrAddService(service: WithUUID<typeof Service>): Service;

	}
}

declare module 'homebridge/lib/logger' {
	// tslint:disable-next-line: no-empty-interface
	export interface Logger extends LoggerLike {

	}

	// tslint:disable-next-line: no-empty-interface
	export interface Logging extends LoggerLike {

	}
}

declare module 'hap-nodejs/dist/lib/Characteristic' {
	export interface Characteristic {
		 onSet<T extends CharacteristicValue>(func: (...args: any) => Promise<T>): Characteristic;
		 onGet<T extends CharacteristicValue>(func: () => T): Characteristic;
	}
}

/* export interface Characteristic {

on(eventType: CharacteristicEventTypes, func: (...args) => void): Characteristic;
onSet<T>(characteristic: Characteristic, func: (...args) => Promise<T>): Characteristic;
onGet<T>(characteristic: Characteristic, func: (...args) => Promise<T>): Characteristic;
}
} */

(Characteristic.prototype).onSet = function(func: (arg: CharacteristicValue) => Promise<any>): Characteristic {
	const c = this as unknown as Characteristic;
	return onSet(c, func);
};

// tslint:disable-next-line: only-arrow-functions

(Logger.prototype).trace = (...msg: any[]) => {
	const log = this as unknown as Logger;
	// onst newMsg = chalk.dim(msg);
	if (log.isTraceEnabled()) {
		log.log.apply(this, ['trace'].concat(msg));
	}
};

(Logger.prototype).fatal = (...msg: any[]) => {
	const log = this as unknown as Logger;
	// const newMsg = chalk.dim(msg);
	if (log?.isFatalEnabled()) {
		log.error(msg[0], msg.shift());
	}
};

(Logger.prototype).isDebugEnabled = () => true;

(Logger.prototype).isErrorEnabled = () => true;

(Logger.prototype).isWarnEnabled = () => true;

(Logger.prototype).isFatalEnabled = () => true;

(Logger.prototype).isTraceEnabled = () => true;

(Logger.prototype).call = (msg: any) => {
	const l = this as unknown as Logger;
	l.info(msg);
};

((Characteristic as any).prototype).onGet = function(func: () => CharacteristicValue): Characteristic {
	const c = this as unknown as Characteristic;
	return onGet(c, func);

};

// (service.Service.prototype as any).changeCharacteristic = (name: WithUUID<typeof Characteristic>, value: CharacteristicValue) => {

// 	const t = this as unknown as service.Service;
// 	t.getCharacteristic(name).updateValue(value);
// };

Promise.prototype.handleWith = async function <T extends CharacteristicValue>(callback: (error?: Error | null | undefined, value?: CharacteristicValue) => void): Promise<void> {
	return (this as Promise<T>).then((value) => {
		callback(null, value);
	}).catch((msg) => {
		callback(new Error(msg), msg);
	});
};

export function addGetCallback<T extends CharacteristicValue>(func: (...args: any[]) => Promise<T>): (arg: any, cb: CharacteristicGetCallback) => void {

	return (arg: any, cb: CharacteristicGetCallback) => {
		// assumption is function has signature of (val, callback, args..)

		try {

			func(arg).handleWith(cb);
		} catch {
			throw new Error('Last argument of callback is not a function.');
		}

	};

}

export function addSetCallback<T extends CharacteristicValue>(func: (...args: any[]) => Promise<T>): (arg: any, cb: CharacteristicSetCallback) => void {

	return (arg: any, cb: CharacteristicSetCallback) => {
		// assumption is function has signature of (val, callback, args..)

		// const n = newArgs[1];

		try {

			func(arg).handleWith(cb);
		} catch {
			throw new Error('Last argument of callback is not a function.');
		}

	};

}

export function addCallback<T>(func: (...args: any[]) => Promise<T>): (arg: any, cb: CharacteristicSetCallback) => void {

	return (arg: any, cb: CharacteristicSetCallback) => {
		// assumption is function has signature of (val, callback, args..)
		console.log('entering new function');
		console.log(arg);

		// const n = newArgs[1];

		try {
			console.log(func);
			console.log(cb);
			func(arg).handleWith(cb);
		} catch {
			throw new Error('Last argument of callback is not a function.');
		}

	};

}
