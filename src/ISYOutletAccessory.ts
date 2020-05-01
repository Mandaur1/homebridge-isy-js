import './utils';

import { Categories, Characteristic, CharacteristicEventTypes, Service } from 'hap-nodejs';
import { InsteonOutletDevice, InsteonOnOffOutletDevice } from 'isy-nodejs';

import { ISYDeviceAccessory } from './ISYDeviceAccessory';
import { Outlet } from 'hap-nodejs/dist/lib/gen/HomeKit';

export class ISYOnOffOutletAccessory extends ISYDeviceAccessory<InsteonOnOffOutletDevice,Categories.OUTLET>
{
	public get outlet1Service() : Service {
		if(!this.primaryService)
		{
			this.primaryService = this.platformAccessory?.getOrAddService(Service.Outlet);
		}
			return this.primaryService;
	}

	_outlet2Service: Service;

	public get outlet2Service(): Service {

		if(!this._outlet2Service)
			this._outlet2Service = this.platformAccessory.addService(new Service.Outlet('Outlet 2','2'));
		return this._outlet2Service;

	}
	constructor(device: InsteonOnOffOutletDevice)
	{
		super(device);

		this.category = Categories.OUTLET;
	}
	public map(propertyName, propertyValue)
	{
		if (propertyName === 'outlet1.ST') {
			return { characteristicValue: propertyValue, characteristic: Characteristic.On, service: this.outlet1Service };
		} else if (propertyName === 'outlet2.ST') {
			return { characteristicValue: propertyValue, characteristic: Characteristic.On, service: this.outlet2Service };
		}
	}

	public setupServices()
	{
		super.setupServices();

		this.outlet1Service.getCharacteristic(Characteristic.On).onSet((this.device.outlet1.updateIsOn).bind(this.device.outlet1));
		this.outlet1Service.getCharacteristic(Characteristic.On).onGet(() => this.outlet1.isOn);
		this.outlet1Service.getCharacteristic(Characteristic.OutletInUse).onGet(() => true);
		this.outlet2Service.getCharacteristic(Characteristic.On).onSet((this.device.outlet2.updateIsOn).bind(this.device.outlet2));
		this.outlet2Service.getCharacteristic(Characteristic.On).onGet(() => this.outlet2.isOn);
		this.outlet2Service.getCharacteristic(Characteristic.OutletInUse).onGet(() => true);
	}
}

export class ISYOutletAccessory extends ISYDeviceAccessory<InsteonOutletDevice,Categories.OUTLET> {

	constructor(device: InsteonOutletDevice) {
		super(device);
		this.category = Categories.OUTLET;
	}
	// Handles the identify command
	// Handles a request to set the outlet state. Ignores redundant sets based on current states.
	// Handles a request to get the current in use state of the outlet. We set this to true always as
	// there is no way to deterine this through the isy.

	// Mirrors change in the state of the underlying isj-js device object.
	public handlePropertyChange(propertyName: string, value: any, oldValue: any, formattedValue: string) {
		super.handlePropertyChange(propertyName, value, oldValue, formattedValue);
		this.outletService.updateCharacteristic(Characteristic.On, this.device.isOn);
	}
	// Returns the set of services supported by this object.
	public setupServices() {
		super.setupServices();
		const outletService = this.platformAccessory.getOrAddService(Service.Outlet);

		this.primaryService = outletService;
		outletService.getCharacteristic(Characteristic.On).onSet(this.bind(this.device.updateIsOn));
		outletService.getCharacteristic(Characteristic.On).onGet(() => this.device.isOn);
		outletService.getCharacteristic(Characteristic.OutletInUse).onGet(() => true); /*Insteon Outlets Do not report this*/

	}
}
