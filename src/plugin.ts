// import { CharacteristicEventTypes, CharacteristicProps, CharacteristicValue, WithUUID } from 'hap-nodejs';


import { ISYPlatform } from './ISYPlatform';
import { API } from 'homebridge/lib/api'




export default (homebridge: API) => {
	//const Service = homebridge.hap.Service;

	//const Hap = homebridge.hap;

	//onst Characteristic = homebridge.hap.Characteristic;
	//const api = homebridge;
	homebridge.registerPlatform(`homebridge-isy-js`, 'isy-js', ISYPlatform,null);
};
