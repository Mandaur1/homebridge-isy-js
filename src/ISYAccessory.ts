import { Accessory, Bridged, Categories, Characteristic, Service, TargetCategory } from 'hap-nodejs';
import { AccessoryInformation } from 'hap-nodejs/dist/lib/gen/HomeKit';
import { generate } from 'hap-nodejs/dist/lib/util/uuid';
import { API } from 'homebridge';
import { Logger } from 'homebridge/lib/logger';
import { PlatformAccessory } from 'homebridge/lib/platformAccessory';
import { Controls, Family, ISYNode } from 'isy-js';
import ISYConstants from 'isy-js/lib/isyconstants';





export class ISYAccessory<T extends ISYNode, TCategory extends Categories> {
	[x: string]: any;
	public logger: Logger;
	public device: T;
	public address: any;
	public UUID: string;
	public informationService: Service;
	public name: string;
	public displayName: string;
	public platformAccessory: PlatformAccessory;
	public readonly category : TCategory;

	// tslint:disable-next-line: ban-types
	public bind<TFunction extends Function>(func: TFunction) : TFunction
	{
		return func.bind(this.device);
	}


	constructor (device: T) {
		const s = generate(`${device.isy.address}:${device.address}`);
		///super(device.displayName, s);

		this.UUID = s;
		this.name = device.name;
		this.displayName = device.displayName;
		// super(device.name,hapNodeJS.uuid.generate(device.isy.address + ":" + device.address))
		this.logger = new Logger(`ISY Device: ${this.name}`);
		this.device = device;
		this.address = device.address;
		//this.getServices();
		this.device.onPropertyChanged(null, this.handleExternalChange.bind(this));
	}

	public configure(accessory?: PlatformAccessory)
	{
		this.platformAccessory = accessory ?? new PlatformAccessory(this.displayName, this.UUID, this.category);
		const pa = this.platformAccessory;
		this.setupServices();

		pa.once('identify',(...args: any[]) => {
			let a = pa._associatedHAPAccessory as Accessory;
			this.logger.debug('identify requested');
			a?.setPrimaryService(a.services[1]);
			this.identify(args[0]);
		})
	}


	public setupServices(): Service[] {
		this.informationService = this.platformAccessory.getOrAddService(Service.AccessoryInformation);
		if (!this.informationService) {
			this.logger.trace('information service needs to be created');
			this.informationService = this.platformAccessory.addService(Service.AccessoryInformation);
		}

		this.informationService
			.setCharacteristic(Characteristic.Manufacturer,
				Family[this.device.family])
			.setCharacteristic(Characteristic.Model, this.device.productName ?? this.device.name)
			.setCharacteristic(Characteristic.SerialNumber, this.device.modelNumber)
			.setCharacteristic(Characteristic.FirmwareRevision, this.device.version)
			.setCharacteristic(Characteristic.ProductData, this.device.address);

		return [this.informationService];
	}
	public handleExternalChange(propertyName: string, value: any, formattedValue: string) {
		const name = propertyName in Controls ? Controls[propertyName].label : propertyName;
		this.logger.debug(`Incoming update to ${name}. Device says: ${value} (${formattedValue})`);
	}
	public convertToHK(propertyName: string, value: any) {
		return value;
	}
	public identify(callback: any) {
		// Do the identify action
		callback();
	}
}
