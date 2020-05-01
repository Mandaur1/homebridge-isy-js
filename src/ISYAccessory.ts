import { Accessory, Bridged, Categories, Characteristic, CharacteristicValue, Service, TargetCategory, UUID, WithUUID } from 'hap-nodejs';
import { generate } from 'hap-nodejs/dist/lib/util/uuid';
import { API } from 'homebridge';
import { Logger, Logging } from 'homebridge/lib/logger';
import { PlatformAccessory } from 'homebridge/lib/platformAccessory';
import { Controls, Family, ISYNode } from 'isy-nodejs';
import ISYConstants, { NodeType } from 'isy-nodejs/lib/isyconstants';

import { PlatformName } from './plugin';
import { EventEmitter } from 'events';
import { LightSensor } from 'hap-nodejs/dist/lib/gen/HomeKit';

export class AccessoryContext {
	public address: string;
}

(PlatformAccessory.prototype).getOrAddService = function <T extends WithUUID<typeof Service>> (service: T): Service {
	const acc = this as unknown as PlatformAccessory;
	const serv = acc.getService(service);
	if (!serv) {
		return acc.addService(service);
	}

	return serv;
};

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
	public category: TCategory;
	public primaryService: Service;

	// tslint:disable-next-line: ban-types
	public bind<TFunction extends Function>(func: TFunction): TFunction {
		return func.bind(this.device);
	}

	constructor(device: T) {
		const s = generate(`${device.isy.address}:${device.address}1`);
		/// super(device.displayName, s);
		this.UUID = s;
		this.name = device.name;
		this.displayName = device.displayName;
		// super(device.name,hapNodeJS.uuid.generate(device.isy.address + ":" + device.address))
		this.logger = new Logger(`${PlatformName}: ${this.name}`);
		this.device = device;
		this.address = device.address;
		this.context = new AccessoryContext();
		this.context.address = this.address;
		this.device.on('PropertyChanged', this.handlePropertyChange.bind(this));
		this.device.on('ControlTriggered',this.handleControlTrigger.bind(this));
	}

	public map(propertyName: keyof T, propertyValue: any): { characteristicValue: CharacteristicValue, characteristic?: WithUUID<new () => Characteristic>, service: Service} {
		//let output = {characteristic: Characteristic, service: typeof Service};
		if (propertyName === 'ST') {
			return {characteristicValue: propertyValue, characteristic: Characteristic.On, service: this.primaryService};
		}

		return { characteristicValue: propertyValue, service: this.primaryService};
	}

	public handleControlTrigger(controlName: string)
	{
		this.logger.info(`${Controls[controlName].label} triggered.`);
	}

	public configure(accessory?: PlatformAccessory) {
		if (accessory) {
			if (!accessory.getOrAddService) {
				accessory.getOrAddService = PlatformAccessory.prototype.getOrAddService.bind(accessory);


			}
			accessory.displayName = this.displayName;
			this.platformAccessory = accessory;
			this.platformAccessory.context.address = this.address;
			this.logger.info('Configuring linked platform accessory');

		} else {
			this.platformAccessory = new PlatformAccessory(this.displayName, this.UUID, this.category);
			this.platformAccessory.context.address = this.address;
			this.logger.info('New platform accessory needed');

		}
		this.setupServices();
		this.primaryService.isPrimaryService = true;
		this.platformAccessory.on('identify', () => this.identify.bind(this));
	}

	public setupServices() {
		this.informationService = this.platformAccessory.getOrAddService(Service.AccessoryInformation);
		this.informationService
			.getCharacteristic(Characteristic.Manufacturer).updateValue(
				Family[this.device.family] ?? 'Universal Devices, Inc.');
		this.informationService.getCharacteristic(Characteristic.Model).updateValue(this.device.productName ?? this.device.name);
		this.informationService.getCharacteristic(Characteristic.SerialNumber).updateValue(this.device.modelNumber ?? this.device.address);
		this.informationService.getCharacteristic(Characteristic.FirmwareRevision).updateValue(this.device.version ?? '1.0');
			// .setCharacteristic(Characteristic.ProductData, this.device.address);

	}

	public handlePropertyChange(propertyName: string, value: any, oldValue: any, formattedValue: string) {
		const name = propertyName in Controls ? Controls[propertyName].label : propertyName;
		this.logger.info(`Incoming update to ${name}. New Value: ${value} (${formattedValue}) Old Value: ${oldValue}`);
		const m = this.map(propertyName,value);
		if (m.characteristic) {
			this.logger.debug('Property mapped to:',m.service.displayName, m.characteristic.name);
			this.updateCharacteristicValue(m.characteristicValue, m.characteristic, m.service);
		}
		else
		{
			this.logger.info('Property not mapped.');
		}

	}

	public updateCharacteristicValue(value: CharacteristicValue, characteristic:  WithUUID<new () => Characteristic>, service: Service) {
		service.getCharacteristic(characteristic)?.updateValue(value);

	}

	public convertToHK(propertyName: string, value: any) {
		return value;
	}
	public identify() {
		// Do the identify action

	}
}
