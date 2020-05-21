import { NodeType, Family } from 'isy-nodejs';
import { TunnelConnectionTimeout } from 'hap-nodejs/dist/lib/gen/HomeKit-Bridge';

export interface IgnoreDeviceRule {
	nameContains?: string;
	lastAddressDigit?: string|number;
	address?: string;
	typeCode?: string;
	family?: string|number|Family;
	nodeDef?: string;
	folder?: string;
}

export interface DeviceFilterRule {
	name?: string;
	lastAddressDigit?: string;
	address?: string;
	typeCode?: string;
	family?: Family;
	nodeDef?: string;
	folder?: string;
	function?: string;
	filterType?: 'name' | 'lastAddressDigit' | 'address' | 'typeCode' | 'family' | 'nodeDef' | 'folder' | 'custom';
}


export interface RenameDeviceRule {
	name?: string;
	address?: string;
	newName: string;
}

export interface DeviceConfig extends DeviceConfigDetail
{
	filter: DeviceFilterRule

}

export interface DeviceConfigDetail
{
	triggers?: DevicePropertyTrigger[];
	mapping?: DeviceServiceMapping;
	exclude: boolean;
	newName?: string;
}

export interface DeviceServiceMapping
{
	service: string;
	properties: PropertyCharacteristicMapping[];
}


export interface PropertyCharacteristicMapping
{
	property: string;
	characteristic: string;
}

export interface DevicePropertyTrigger
{
	property: string;
	value: string;
	target:
	{
		name: string;
		address: string;
		command: string;
	}
}

export interface DeviceNameRules
{
	format: string;
	remove?: string[],
	replace?:
	{
		replace: string,
		with: string;
	}[]
}

export interface PlatformConfig {
	platform: string;
	name: string;
	host: string;
	username: string;
	password: string;
	useHttps: boolean;
	elkEnabled: boolean;
	debugLoggingEnabled: boolean;
	deviceDefaults?: DeviceConfig;
	deviceNaming?: DeviceNameRules;

	devices?: DeviceConfig[];

	[x: string]: any;
}