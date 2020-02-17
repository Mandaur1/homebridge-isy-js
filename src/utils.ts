

//import * as service from 'homebridge/node_modules/homebridge/node_modules/hap-nodejs/dist/lib/Service';

import * as characteristic from 'homebridge/node_modules/hap-nodejs/dist/lib/Characteristic';



import * as HAPNodeJS from 'homebridge/node_modules/hap-nodejs';



export let Hap;

declare global {
	interface Promise<T> {
		handleWith(callback: (...any) => void) : Promise<void>;
	}
}

// tslint:disable-next-line: no-namespace

// tslint:disable-next-line: no-namespace

export function onSet<T>(character: characteristic.Characteristic, func: (arg : HAPNodeJS.CharacteristicValue) => Promise<T>): characteristic.Characteristic {
	
	var cfunc = addSetCallback(func);

	return character.on(HAPNodeJS.CharacteristicEventTypes.SET, cfunc);
}

export function onGet<T>(character: characteristic.Characteristic, func: (arg: HAPNodeJS.CharacteristicValue) => Promise<T>): characteristic.Characteristic {

	var cfunc = addGetCallback(func)

	return character.on(HAPNodeJS.CharacteristicEventTypes.GET, cfunc)
}


// declare module 'homebridge/node_modules/homebridge/node_modules/hap-nodejs/dist/lib/Service' {

// 	export interface Service {

// 		updateCharacteristic<T extends HAPNodeJS.WithUUID<typeof characteristic.Characteristic>>(name: T, value: HAPNodeJS.CharacteristicValue): void;

// 	}


// }

declare module 'homebridge/node_modules/hap-nodejs/dist/lib/Characteristic' {
	export interface Characteristic {
		onSet<T>(func: (...args: any) => Promise<T>) : Characteristic;
		onGet<T>(func: (...args: any) => Promise<T>) : Characteristic;
	}
	
}

	/* export interface Characteristic {

	on(eventType: CharacteristicEventTypes, func: (...args) => void): Characteristic;
	onSet<T>(characteristic: Characteristic, func: (...args) => Promise<T>): Characteristic;
	onGet<T>(characteristic: Characteristic, func: (...args) => Promise<T>): Characteristic;
	}
} */

(characteristic.Characteristic.prototype).onSet = function (func: (arg: HAPNodeJS.CharacteristicValue) => Promise<any>) : characteristic.Characteristic {
	var c = this as unknown as characteristic.Characteristic;
	 return onSet(c,func);
	
};

(characteristic.Characteristic.prototype).onGet = function (func: (arg: HAPNodeJS.CharacteristicValue) => Promise<any>): characteristic.Characteristic {
	var c = this as unknown as characteristic.Characteristic
	return onGet(c, func)

};

// (service.Service.prototype as any).changeCharacteristic = (name: HAPNodeJS.WithUUID<typeof HAPNodeJS.Characteristic>, value: HAPNodeJS.CharacteristicValue) => {

// 	const t = this as unknown as service.Service;
// 	t.getCharacteristic(name).updateValue(value);
// };

Promise.prototype.handleWith = async function<T>(callback: (...any) => void) : Promise<void>{
	return (this as Promise<T>).then((value) => {
		callback(false,value);
	}).catch((msg) => {
		callback(true);
	});
};

export function addGetCallback<T>(func: (...args: any[]) => Promise<T>): (arg: any, cb: characteristic.CharacteristicGetCallback) => void {

	return (arg: any, cb: characteristic.CharacteristicGetCallback) => {
		// assumption is function has signature of (val, callback, args..)
		

		try {
			
			func(arg).handleWith(cb)
		} catch {
			throw new Error('Last argument of callback is not a function.')
		}

	}

}

export function addSetCallback<T>(func: (...args: any[]) => Promise<T>): (arg: any, cb: characteristic.CharacteristicSetCallback) => void {

	return (arg: any, cb: characteristic.CharacteristicSetCallback) => {
		// assumption is function has signature of (val, callback, args..)


		//const n = newArgs[1];

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
		console.log("entering new function");
		console.log(arg);
		
		//const n = newArgs[1];
		
		try {
			console.log(func);
			console.log(cb);
			func(arg).handleWith(cb);
		} catch {
			throw new Error('Last argument of callback is not a function.');
		}

	};

}

