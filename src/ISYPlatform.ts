import { IgnoreDeviceRule, PlatformConfig } from 'config'

import {
	ElkAlarmSensorDevice,
	InsteonDimmableDevice,
	InsteonDoorWindowSensorDevice,
	InsteonFanDevice,
	InsteonLockDevice,
	InsteonMotionSensorDevice,
	InsteonOutletDevice,
	InsteonRelayDevice,
	InsteonThermostatDevice,
	ISY,
	ISYNode,
	NodeTypes,
	ISYDevice,
	ISYScene,
} from 'isy-js'

import { ISYDimmableAccessory } from './ISYDimmerAccessory'
import { ISYDoorWindowSensorAccessory } from './ISYDoorWindowSensorAccessory'
import { ISYElkAlarmPanelAccessory } from './ISYElkAlarmPanelAccessory'
import { ISYFanAccessory } from './ISYFanAccessory'
import { ISYGarageDoorAccessory } from './ISYGarageDoorAccessory'
import { ISYLockAccessory } from './ISYLockAccessory'
import { ISYMotionSensorAccessory } from './ISYMotionSensorAccessory'
import { ISYOutletAccessory } from './ISYOutletAccessory'
import { ISYRelayAccessory } from './ISYRelayAccessory'
import { ISYSceneAccessory } from './ISYSceneAccessory'
import { ISYThermostatAccessory } from './ISYThermostatAccessory'
import { API } from 'homebridge/lib/api'
import { ISYAccessory } from 'ISYAccessory'
import { ISYDeviceAccessory } from 'ISYDeviceAccessory'
// tslint:disable-next-line: ordered-imports

export class ISYPlatform {
	public log: any
	public config: PlatformConfig
	public host: string
	public username: string
	public password: string
	public elkEnabled: boolean
	public debugLoggingEnabled: boolean
	public includeAllScenes: boolean
	public includedScenes: []
	public ignoreRules: IgnoreDeviceRule[]
	public homebridge: API
	public isy: ISY
	constructor (log: (msg: any) => void, config: PlatformConfig, homebridge: API) {
		this.log = log
		this.config = config
		this.host = config.host
		this.username = config.username
		this.password = config.password
		this.elkEnabled = config.elkEnabled
		this.debugLoggingEnabled = config.debugLoggingEnabled === undefined ? false : config.debugLoggingEnabled
		this.includeAllScenes = config.includeAllScenes === undefined ? false : config.includeAllScenes
		this.includedScenes = config.includedScenes === undefined ? [] : config.includedScenes
		this.ignoreRules = config.ignoreDevices
		this.homebridge = homebridge

		this.isy = new ISY(this.host, this.username, this.password, config.elkEnabled, null, config.useHttps, true, this.debugLoggingEnabled, null, log)
	}
	public logger(msg: string) {
		if (this.debugLoggingEnabled || (process.env.ISYJSDEBUG !== undefined && process.env.IYJSDEBUG !== null)) {
			// var timeStamp = new Date();
			this.log(`Platform: ${msg}`)
		}
	}
	// Checks the device against the configuration to see if it should be ignored.
	public shouldIgnore(device: ISYNode) {
		const deviceAddress = device.address
		let returnValue = true
		if (device instanceof ISYScene && this.includeAllScenes === false) {
			for (const sceneAddress of this.includedScenes) {
				if (sceneAddress === deviceAddress) {
					return false;
				}
			}

		}
		if (this.config.ignoreDevices === undefined) {
			return false
		}
		if (this.includeAllScenes || device instanceof ISYDevice) {
			const deviceName = device.name
			for (const rule of this.ignoreRules) {
				if (rule.nameContains !== undefined && rule.nameContains !== '') {
					if (deviceName.indexOf(rule.nameContains) === -1) {
						continue
					}
				}
				if (rule.lastAddressDigit !== undefined && rule.lastAddressDigit !== null) {
					if (deviceAddress.indexOf(String(rule.lastAddressDigit), deviceAddress.length - 2) === -1) {
						continue
					}
				}
				if (rule.address !== undefined && rule.address !== '') {
					if (deviceAddress !== rule.address) {
						continue
					}
				}
				if (rule.nodeDef !== undefined) {
					if (device.nodeDefId !== rule.nodeDef) {
						continue
					}
				}
				if (rule.folder !== undefined) {
					if (device.folder !== rule.folder) {
						continue
					}
				}
				this.logger('Ignoring device: ' + deviceName + ' (' + deviceAddress + ') because of rule: ' + JSON.stringify(rule))
				return true
			}
		}

		return false
	}
	public getGarageEntry(address) {
		const garageDoorList = this.config.garageDoors
		if (garageDoorList !== undefined) {
			for (let index = 0; index < garageDoorList.length; index++) {
				const garageEntry = garageDoorList[index]
				if (garageEntry.address === address) {
					return garageEntry
				}
			}
		}
		return null
	}
	public renameDeviceIfNeeded(device: ISYNode) {
		const deviceAddress = device.address
		const deviceName = device.name
		//if (this.config.renameDevices === undefined) {
		//return deviceName;
		//}
		if (this.config.transformNames !== undefined) {
			if (this.config.transformNames.remove !== undefined)
				for (const removeText of this.config.transformNames.remove) {
					deviceName.replace(removeText, '')

				}
			if (this.config.transformNames.replace !== undefined)
				for (const replaceRule of this.config.transformNames.replace) {
					deviceName.replace(replaceRule.replace, replaceRule.with)

				}
		}
		if (this.config.renameDevices !== undefined) {
			for (const rule of this.config.renameDevices) {
				if (rule.name !== undefined && rule.name !== '') {
					if (deviceName.indexOf(rule.name) === -1) {
						continue
					}
				}

				if (rule.address !== undefined && rule.address !== '') {
					if (deviceAddress !== rule.address) {
						continue
					}
				}
				if (rule.newName === undefined) {
					this.logger(`Rule to rename device is present but no new name specified. Impacting device: ${deviceName}`)
					return deviceName
				} else {
					this.logger(`Renaming device: ${deviceName}[${deviceAddress}] to [${rule.newName}] because of rule [${rule.name}] [${rule.newName}] [${rule.address}]`)
					return rule.newName
				}
			}
		}
		return deviceName
	}
	// Calls the isy-js library, retrieves the list of devices, and maps them to appropriate ISYXXXXAccessory devices.
	public accessories(callback) {
		const that = this
		this.isy.initialize(() => {
			const results = []
			const deviceList = this.isy.deviceList
			for (const device of deviceList.values()) {
				let homeKitDevice = null
				const garageInfo = that.getGarageEntry(device.address)
				if (!that.shouldIgnore(device)) {
					if (results.length >= 100) {
						that.logger('Skipping any further devices as 100 limit has been reached')
						break
					}
					device.name = that.renameDeviceIfNeeded(device)
					if (garageInfo !== null) {
						let relayAddress = device.address.substr(0, device.address.length - 1)
						relayAddress += `2`
						const relayDevice = that.isy.getDevice(relayAddress)
						homeKitDevice = new ISYGarageDoorAccessory(that.logger.bind(that), device, relayDevice, garageInfo.name, garageInfo.timeToOpen, garageInfo.alternate)
					} else {
						homeKitDevice = that.createAccessory(device)
					}
					if (homeKitDevice !== null) {
						// Make sure the device is address to the global map
						// deviceMap[device.address] = homeKitDevice;
						results.push(homeKitDevice)
					}
				}
			}
			for (const scene of this.isy.sceneList.values()) {
				if (!this.shouldIgnore(scene)) {
					results.push(new ISYSceneAccessory(this.logger.bind(this), scene))
				}
			}

			if (that.isy.elkEnabled) {
				if (results.length >= 100) {
					that.logger('Skipping adding Elk Alarm panel as device count already at maximum')
				} else {
					const panelDevice = that.isy.getElkAlarmPanel()
					panelDevice.name = that.renameDeviceIfNeeded(panelDevice)
					const panelDeviceHK = new ISYElkAlarmPanelAccessory(that.log, panelDevice)
					// deviceMap[panelDevice.address] = panelDeviceHK;
					results.push(panelDeviceHK)
				}
			}
			that.logger(`Filtered device list has: ${results.length} devices`)
			callback(results)
		})
	}
	public createAccessory(device: ISYDevice) {

		if (device instanceof InsteonDimmableDevice) {
			return new ISYDimmableAccessory(this.logger.bind(this), device)
		} else if (device instanceof InsteonRelayDevice) {
			return new ISYRelayAccessory(this.logger.bind(this), device)
		} else if (device instanceof InsteonLockDevice) {
			return new ISYLockAccessory(this.logger.bind(this), device)
		} else if (device instanceof InsteonOutletDevice) {
			return new ISYOutletAccessory(this.logger.bind(this), device)
		} else if (device instanceof InsteonFanDevice) {
			return new ISYFanAccessory(this.logger.bind(this), device)
		} else if (device instanceof InsteonDoorWindowSensorDevice) {
			return new ISYDoorWindowSensorAccessory(this.logger.bind(this), device)
		} else if (device instanceof ElkAlarmSensorDevice) {
			return new ISYElkAlarmPanelAccessory(this.logger.bind(this), device)
		} else if (device instanceof InsteonMotionSensorDevice) {
			return new ISYMotionSensorAccessory(this.logger.bind(this), device)
		} else if (device instanceof InsteonThermostatDevice) {
			return new ISYThermostatAccessory(this.logger.bind(this), device)
		}
		return null
	}
}
