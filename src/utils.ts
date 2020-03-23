import * as HAPNodeJS from 'hap-nodejs';
import { CharacteristicValue } from 'hap-nodejs';
import * as characteristic from 'hap-nodejs/dist/lib/Characteristic';



// import * as service from 'homebridge/node_modules/homebridge/node_modules/hap-nodejs/dist/lib/Service';





export let Hap;

declare global {
	interface Promise<T> {
		handleWith(callback: (...any) => void) : Promise<void>;
	}
}

// tslint:disable-next-line: no-namespace

// tslint:disable-next-line: no-namespace

export function onSet<T extends CharacteristicValue>(character: characteristic.Characteristic, func: (arg : T) => Promise<any>): characteristic.Characteristic {

	const cfunc = addSetCallback(func);

	return character.on(HAPNodeJS.CharacteristicEventTypes.SET, cfunc);
}

// export function onGetAsync<T>(character: characteristic.Characteristic, func: (arg: HAPNodeJS.CharacteristicValue) => Promise<T>): characteristic.Characteristic {

// 	const cfunc = addGetCallback(func)

// 	return character.on(HAPNodeJS.CharacteristicEventTypes.GET, cfunc);
// }

export function onGet<T extends CharacteristicValue>(character: characteristic.Characteristic, func: () => T): characteristic.Characteristic {

	const cfunc = (cb: characteristic.CharacteristicGetCallback) => {
		cb(null,func());
	}

	return character.on(HAPNodeJS.CharacteristicEventTypes.GET, cfunc);
}

// declare module 'homebridge/node_modules/homebridge/node_modules/hap-nodejs/dist/lib/Service' {

// 	export interface Service {

// 		updateCharacteristic<T extends HAPNodeJS.WithUUID<typeof characteristic.Characteristic>>(name: T, value: HAPNodeJS.CharacteristicValue): void;

// 	}


// }

declare module 'hap-nodejs/dist/lib/Characteristic' {
	export interface Characteristic {
		onSet<T extends CharacteristicValue>(func: (...args: any) => Promise<T>) : Characteristic;
		onGet<T extends CharacteristicValue>(func: () => T) : Characteristic;
	}

}

	/* export interface Characteristic {

	on(eventType: CharacteristicEventTypes, func: (...args) => void): Characteristic;
	onSet<T>(characteristic: Characteristic, func: (...args) => Promise<T>): Characteristic;
	onGet<T>(characteristic: Characteristic, func: (...args) => Promise<T>): Characteristic;
	}
} */

(characteristic.Characteristic.prototype).onSet = function (func: (arg: HAPNodeJS.CharacteristicValue) => Promise<any>) : characteristic.Characteristic {
	const c = this as unknown as characteristic.Characteristic;

	 return onSet(c,func);

};

(characteristic.Characteristic.prototype).onGet = function (func: () => HAPNodeJS.CharacteristicValue): characteristic.Characteristic {
	const c = this as unknown as characteristic.Characteristic
	return onGet(c, func)

};

// (service.Service.prototype as any).changeCharacteristic = (name: HAPNodeJS.WithUUID<typeof HAPNodeJS.Characteristic>, value: HAPNodeJS.CharacteristicValue) => {

// 	const t = this as unknown as service.Service;
// 	t.getCharacteristic(name).updateValue(value);
// };

Promise.prototype.handleWith = async function<T extends CharacteristicValue>(callback: (error? : Error | null | undefined, value? : CharacteristicValue) => void) : Promise<void>{
	return (this as Promise<T>).then((value) => {
		callback(null,value);
	}).catch((msg) => {
		callback(new Error(msg),msg);
	});
};

export function addGetCallback<T extends CharacteristicValue>(func: (...args: any[]) => Promise<T>): (arg: any, cb: characteristic.CharacteristicGetCallback) => void {

	return (arg: any, cb: characteristic.CharacteristicGetCallback) => {
		// assumption is function has signature of (val, callback, args..)


		try {

			func(arg).handleWith(cb)
		} catch {
			throw new Error('Last argument of callback is not a function.')
		}

	}

}

export function addSetCallback<T extends CharacteristicValue>(func: (...args: any[]) => Promise<T>): (arg: any, cb: characteristic.CharacteristicSetCallback) => void {

	return (arg: any, cb: characteristic.CharacteristicSetCallback) => {
		// assumption is function has signature of (val, callback, args..)


		// const n = newArgs[1];

		try {

			func(arg).handleWith(cb);
		} catch {
			throw new Error('Last argument of callback is not a function.')
		}

	}

}

export function addCallback<T>(func: (...args : any[]) => Promise<T>): (arg : any, cb: characteristic.CharacteristicSetCallback) => void {

	return (arg: any, cb: characteristic.CharacteristicSetCallback) => {
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
