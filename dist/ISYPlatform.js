"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

const logger_1 = require("homebridge/lib/logger");

const isy_nodejs_1 = require("isy-nodejs");

const ISYDimmerAccessory_1 = require("./ISYDimmerAccessory");

const ISYDoorWindowSensorAccessory_1 = require("./ISYDoorWindowSensorAccessory");

const ISYLeakSensorAccessory_1 = require("./ISYLeakSensorAccessory");

const ISYElkAlarmPanelAccessory_1 = require("./ISYElkAlarmPanelAccessory");

const ISYFanAccessory_1 = require("./ISYFanAccessory");

const ISYGarageDoorAccessory_1 = require("./ISYGarageDoorAccessory");

const ISYLockAccessory_1 = require("./ISYLockAccessory");

const ISYMotionSensorAccessory_1 = require("./ISYMotionSensorAccessory");

const ISYOutletAccessory_1 = require("./ISYOutletAccessory");

const ISYRelayAccessory_1 = require("./ISYRelayAccessory");

const ISYSceneAccessory_1 = require("./ISYSceneAccessory");

const ISYThermostatAccessory_1 = require("./ISYThermostatAccessory");

const plugin_1 = require("./plugin");

require("./utils"); // tslint:disable-next-line: ordered-imports


class ISYPlatform {
  constructor(log, config, homebridge) {
    this.accessories = [];
    this.accessoriesWrappers = new Map();
    this.accessoriesToRegister = [];
    this.accessoriesToConfigure = new Map();
    this.log = log;
    this.config = config;
    this.host = config.host;
    this.username = config.username;
    this.password = config.password;
    this.elkEnabled = config.elkEnabled;
    this.debugLoggingEnabled = config.debugLoggingEnabled === undefined ? false : config.debugLoggingEnabled;
    this.includeAllScenes = config.includeAllScenes === undefined ? false : config.includeAllScenes;
    this.includedScenes = config.includedScenes === undefined ? [] : config.includedScenes;
    this.ignoreRules = config.ignoreDevices;
    this.homebridge = homebridge;
    ISYPlatform.Instance = this;
    config.address = this.host;
    this.isy = new isy_nodejs_1.ISY(config, logger_1.Logger.withPrefix('isy-nodejs'));
    const p = this.createAccessories();
    const self = this;
    homebridge.on("didFinishLaunching"
    /* DID_FINISH_LAUNCHING */
    , async () => {
      self.logger('Homebridge Launched');
      await p;
      self.log('ISY API Initialized');
      self.log('Homebridge API Version', self.homebridge.version);
      self.log('Homebridge Server Version', self.homebridge.serverVersion);
      self.log('ISY Host Address', self.host);
      self.log('ISY Model', self.isy.model);
      self.log('ISY Firmware Version', self.isy.serverVersion);
      self.logger(`Total Accessories: ${this.accessories.length}`);
      self.logger(`Total Accessories Identified: ${this.accessoriesWrappers.size}`);
      self.logger(`Accessories to Register: ${this.accessoriesToRegister.length}`);

      if (this.accessoriesToRegister.length > 0) {
        self.logger('Registering Platform Accessories');
        self.homebridge.registerPlatformAccessories(plugin_1.PluginName, plugin_1.PlatformName, this.accessoriesToRegister);
        this.accessoriesToRegister = [];
      }

      self.logger(`Accessories to Remove: ${this.accessoriesToConfigure.size}`);

      if (this.accessoriesToConfigure.size > 0) {
        self.logger('Removing Platform Accessories');
        self.homebridge.unregisterPlatformAccessories(plugin_1.PluginName, plugin_1.PlatformName, Array.from(this.accessoriesToConfigure.values()));
        this.accessoriesToConfigure.clear();
      }

      self.homebridge.updatePlatformAccessories(this.accessories);
    });
  }

  logger(msg) {
    if (this.debugLoggingEnabled || process.env.ISYJSDEBUG !== undefined && process.env.IYJSDEBUG !== null) {
      // var timeStamp = new Date();
      this.log.info(`Platform: ${msg}`);
    }
  } // Checks the device against the configuration to see if it should be ignored.


  shouldIgnore(device) {
    const deviceAddress = device.address;
    const returnValue = true;

    if (device instanceof isy_nodejs_1.ISYScene && this.includeAllScenes === false) {
      for (const sceneAddress of this.includedScenes) {
        if (sceneAddress === deviceAddress) {
          return false;
        }
      }
    }

    if (this.config.ignoreDevices === undefined) {
      return false;
    }

    if (this.includeAllScenes || device instanceof isy_nodejs_1.ISYDevice) {
      const deviceName = device.name;

      for (const rule of this.ignoreRules) {
        if (rule.nameContains !== undefined && rule.nameContains !== '') {
          if (deviceName.indexOf(rule.nameContains) === -1) {
            continue;
          }
        }

        if (rule.lastAddressDigit !== undefined && rule.lastAddressDigit !== null) {
          if (deviceAddress.indexOf(String(rule.lastAddressDigit), deviceAddress.length - 2) === -1) {
            continue;
          }
        }

        if (rule.address !== undefined && rule.address !== '') {
          if (deviceAddress !== rule.address) {
            continue;
          }
        }

        if (rule.nodeDef !== undefined) {
          if (device.nodeDefId !== rule.nodeDef) {
            continue;
          }
        }

        if (rule.folder !== undefined) {
          if (device.folder !== rule.folder) {
            continue;
          }
        }

        this.log.info(`Ignoring device: ${deviceName} (${deviceAddress}) because of rule: ${JSON.stringify(rule)}`);
        return true;
      }
    }

    return false;
  }

  getGarageEntry(address) {
    const garageDoorList = this.config.garageDoors;

    if (garageDoorList !== undefined) {
      for (let index = 0; index < garageDoorList.length; index++) {
        const garageEntry = garageDoorList[index];

        if (garageEntry.address === address) {
          return garageEntry;
        }
      }
    }

    return null;
  }

  renameDeviceIfNeeded(device) {
    const deviceAddress = device.address;
    const deviceName = device.name; // if (this.config.renameDevices === undefined) {
    // return deviceName;
    // }

    if (this.config.transformNames !== undefined) {
      if (this.config.transformNames.remove !== undefined) {
        for (const removeText of this.config.transformNames.remove) {
          deviceName.replace(removeText, '');
        }
      }

      if (this.config.transformNames.replace !== undefined) {
        for (const replaceRule of this.config.transformNames.replace) {
          deviceName.replace(replaceRule.replace, replaceRule.with);
        }
      }
    }

    if (this.config.renameDevices !== undefined) {
      for (const rule of this.config.renameDevices) {
        if (rule.name !== undefined && rule.name !== '') {
          if (deviceName.indexOf(rule.name) === -1) {
            continue;
          }
        }

        if (rule.address !== undefined && rule.address !== '') {
          if (deviceAddress !== rule.address) {
            continue;
          }
        }

        if (rule.newName === undefined) {
          this.log.info(`Rule to rename device is present but no new name specified. Impacting device: ${deviceName}`);
          return deviceName;
        } else {
          this.log.info(`Renaming device: ${deviceName}[${deviceAddress}] to [${rule.newName}] because of rule [${rule.name}] [${rule.newName}] [${rule.address}]`);
          return rule.newName;
        }
      }
    }

    return deviceName;
  }

  configureAccessory(accessory) {
    const self = this;

    try {
      const i = this.accessoriesWrappers.get(accessory.UUID);

      if (i) {
        self.log('Accessory Wrapper Exists');
        i.configure(accessory);
      } else {
        this.accessoriesToConfigure.set(accessory.UUID, accessory);
      }

      this.accessories.push(accessory);
      return true;
    } catch (ex) {
      throw ex;
    }
  } // Calls the isy-nodejs library, retrieves the list of devices, and maps them to appropriate ISYXXXXAccessory devices.


  async createAccessories() {
    const that = this;
    await this.isy.initialize(() => {
      const results = [];
      that.log(`Accessories to configure: ${this.accessoriesToConfigure.size}`);
      const deviceList = that.isy.deviceList;
      this.log.info(`ISY has ${deviceList.size} devices and ${that.isy.sceneList.size} scenes`);

      for (const device of deviceList.values()) {
        let homeKitDevice = null;
        let id = '';
        const garageInfo = that.getGarageEntry(device.address);

        if (!that.shouldIgnore(device) && !device.hidden) {
          if (results.length >= 100) {
            that.logger('Skipping any further devices as 100 limit has been reached');
            break;
          }

          device.name = that.renameDeviceIfNeeded(device);

          if (garageInfo !== null) {
            let relayAddress = device.address.substr(0, device.address.length - 1);
            relayAddress += `2`;
            const relayDevice = that.isy.getDevice(relayAddress);
            homeKitDevice = new ISYGarageDoorAccessory_1.ISYGarageDoorAccessory(device, relayDevice, garageInfo.name, garageInfo.timeToOpen, garageInfo.alternate);
          } else {
            homeKitDevice = that.createAccessory(device);
            id = homeKitDevice.UUID;
          }

          if (homeKitDevice !== null) {
            results.push(homeKitDevice); // Make sure the device is address to the global map
            // deviceMap[device.address] = homeKitDevice;
            // results.set(id,homeKitDevice);
          }
        }
      }

      for (const scene of this.isy.sceneList.values()) {
        if (!this.shouldIgnore(scene)) {
          results.push(new ISYSceneAccessory_1.ISYSceneAccessory(scene));
        }
      }

      if (that.isy.elkEnabled && that.isy.getElkAlarmPanel()) {
        // if (results.size >= 100) {
        // that.logger('Skipping adding Elk Alarm panel as device count already at maximum');
        // }
        const panelDevice = that.isy.getElkAlarmPanel();
        panelDevice.name = that.renameDeviceIfNeeded(panelDevice);
        const panelDeviceHK = new ISYElkAlarmPanelAccessory_1.ISYElkAlarmPanelAccessory(panelDevice); // deviceMap[panelDevice.address] = panelDeviceHK;

        results.push(panelDeviceHK);
      }

      that.log.info(`Filtered device list has: ${results.length} devices`);

      for (const homeKitDevice of results) {
        this.accessoriesWrappers.set(homeKitDevice.UUID, homeKitDevice);
        const s = this.accessoriesToConfigure.get(homeKitDevice.UUID);

        if (s !== null && s !== undefined) {
          // that.log("Configuring linked accessory");
          homeKitDevice.configure(s);
          that.accessoriesToConfigure.delete(homeKitDevice.UUID);
        } else {
          homeKitDevice.configure();
          this.accessories.push(homeKitDevice.platformAccessory); // that.homebridge.registerPlatformAccessories(pluginName, platformName, [homeKitDevice.platformAccessory]);

          this.accessoriesToRegister.push(homeKitDevice.platformAccessory);
        }
      }
    });
  }

  createAccessory(device) {
    if (device instanceof isy_nodejs_1.InsteonDimmableDevice) {
      return new ISYDimmerAccessory_1.InsteonDimmableAccessory(device);
    } else if (device instanceof isy_nodejs_1.InsteonRelayDevice) {
      return new ISYRelayAccessory_1.ISYRelayAccessory(device);
    } else if (device instanceof isy_nodejs_1.InsteonLockDevice) {
      return new ISYLockAccessory_1.ISYLockAccessory(device);
    } else if (device instanceof isy_nodejs_1.InsteonOutletDevice) {
      return new ISYOutletAccessory_1.ISYOutletAccessory(device);
    } else if (device instanceof isy_nodejs_1.InsteonFanDevice) {
      return new ISYFanAccessory_1.ISYFanAccessory(device);
    } else if (device instanceof isy_nodejs_1.InsteonDoorWindowSensorDevice) {
      return new ISYDoorWindowSensorAccessory_1.ISYDoorWindowSensorAccessory(device);
    } else if (device instanceof isy_nodejs_1.ElkAlarmSensorDevice) {
      return new ISYElkAlarmPanelAccessory_1.ISYElkAlarmPanelAccessory(device);
    } else if (device instanceof isy_nodejs_1.InsteonMotionSensorDevice) {
      return new ISYMotionSensorAccessory_1.ISYMotionSensorAccessory(device);
    } else if (device instanceof isy_nodejs_1.InsteonThermostatDevice) {
      return new ISYThermostatAccessory_1.ISYThermostatAccessory(device);
    } else if (device instanceof isy_nodejs_1.InsteonLeakSensorDevice) {
      return new ISYLeakSensorAccessory_1.ISYLeakSensorAccessory(device);
    }

    return null;
  }

}

exports.ISYPlatform = ISYPlatform;