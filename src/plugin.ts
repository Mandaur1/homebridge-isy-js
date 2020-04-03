// import { CharacteristicEventTypes, CharacteristicProps, CharacteristicValue, WithUUID } from 'hap-nodejs';
import { API } from 'homebridge';
import { ISYAccessory } from 'ISYAccessory';

import { ISYPlatform } from './ISYPlatform';




export default (homebridge: API) => {
	//const Service = homebridge.hap.Service;

	//const Hap = homebridge.hap;

	//const Characteristic = homebridge.hap.Characteristic;
	 const PlatformAccessory = homebridge.platformAccessory;
	const api = homebridge;
	homebridge.registerPlatform(`homebridge-isy-js`, 'isy-js', ISYPlatform,true);
	return this;

};
