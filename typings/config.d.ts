export interface IgnoreDeviceRule {
	nameContains?: string;
	lastAddressDigit?: string | number;
	address?: string;
	typeCode?: string;
	family?: string|number;
	nodeDef?: string;
	folder?: string;
}

export interface RenameDeviceRule {
	name?: string;
	address?: string;
	newName: string;
}

export interface GlobalRenameRule {
	remove? : string[],
	replace? :
		{
			replace : string,
			with: string
		}[]
}

export interface DeviceConfig
{
	name: string;
	address: string;
	typeCode: string;
	triggers: DevicePropertyTrigger[];
	mapping: DeviceServiceMapping;
	ignore: boolean;
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
	includeAllScenes?: true;
	includedScenes?: string[];
	deviceNameRules?: DeviceNameRules;
	ignoreDevices?: IgnoreDeviceRule[];
	renameDevices?: RenameDeviceRule[];
	transformNames?: GlobalRenameRule;
	deviceConfigs?: DeviceConfig[];
	[x: string]: any;
}