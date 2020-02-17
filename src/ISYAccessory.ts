import { Accessory, Service, Characteristic, Bridged } from 'homebridge/node_modules/hap-nodejs'

import { Controls, ISYNode } from 'isy-js'



import { generate } from 'homebridge/node_modules/hap-nodejs/dist/lib/util/uuid'
import { AccessoryInformation } from 'homebridge/node_modules/hap-nodejs/dist/lib/gen/HomeKit'




export class ISYAccessory<T extends ISYNode> extends Accessory {
	[x: string]: any
	public logger: (msg: any) => void
	public device: T
	public address: any
	public uuid_base: string
	public informationService: Service
	public name: string

	constructor (log: (msg: any) => void, device: T) {
		const s = generate(`${device.isy.address}:${device.address}1`);
		//et pts = device.name.split('.');
		//let deviceType = pts.shift();
		// if (s == 'd2621ae0-9859-4445-a190-2359f9acddbb') log(device.name);
		//let n = `${device.folder} ${pts.join(' ')}`;
		//if (n === '') {
		//	n = device.name;
		//}
		
		super(device.displayName, s)
		this.uuid_base = s
		this.name = device.displayName;
		// super(device.name,hapNodeJS.uuid.generate(device.isy.address + ":" + device.address))

		this.logger = (msg) => {
			log(`Accessory ${device.name}: ${msg}`);
		}
		this.device = device
		this.address = device.address

		this.device.onPropertyChanged(null, this.handleExternalChange.bind(this))
	}
	public getServices(): Service[] {

		this.informationService = this.getService(AccessoryInformation)
		if (!this.informationService) {
			this.logger('information service needs to be created')
			this.informationService = this.addService(Service.AccessoryInformation)
		}
		this.informationService
			.setCharacteristic(Characteristic.Manufacturer, 'Insteon')
			.setCharacteristic(Characteristic.Model, this.device.productName === undefined ? this.device.name : this.device.productName)
			.setCharacteristic(Characteristic.SerialNumber, this.device.address)

		return [this.informationService]
	}
	public handleExternalChange(propertyName: string, value: any, formattedValue: string) {
		const name = propertyName in Controls ? Controls[propertyName].label : propertyName
		this.logger(`Incoming external change to ${name}. Device says: ${value} (${formattedValue})`)
	}
	public convertToHK(propertyName: string, value: any) {
		return value
	}
	public identify(callback: any) {
		// Do the identify action
		callback()
	}
}
