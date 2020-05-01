"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

require("./utils");

const hap_nodejs_1 = require("/usr/local/lib/node_modules/homebridge/node_modules/hap-nodejs/dist/index.js");

const isy_nodejs_1 = require("isy-nodejs");

const ISYDeviceAccessory_1 = require("./ISYDeviceAccessory"); //import { Service } from 'homebridge/node_modules/hap-nodejs/dist/lib/Service';
//import { Characteristic } from 'homebridge/node_modules/hap-nodejs/dist/lib/Characteristic';


class ISYThermostatAccessory extends ISYDeviceAccessory_1.ISYDeviceAccessory {
  constructor(device) {
    super(device);
  }

  toCelsius(temp) {
    return (temp - 32.0) * 5.0 / 9.0;
  }

  toFahrenheit(temp) {
    return Math.round(temp * 9.0 / 5.0 + 32.0);
  }

  getCurrentTemperature(callback) {
    this.logger.info(`Getting Current Temperature - Device says: ${this.device.currentTemperature} says: ${this.toCelsius(this.device.currentTemperature)}`);
    callback(null, this.toCelsius(this.device.currentTemperature));
  }

  getCoolSetPoint(callback) {
    this.logger.info(`Getting Cooling Set Point - Device says: ${this.device.coolSetPoint} translation says: ${this.toCelsius(this.device.coolSetPoint)}`);
    callback(null, this.toCelsius(this.device.coolSetPoint));
  }

  getHeatSetPoint(callback) {
    this.logger.info(`Getting Heating Set Point - Device says: ${this.device.heatSetPoint} translation says: ${this.toCelsius(this.device.heatSetPoint)}`);
    callback(null, this.toCelsius(this.device.heatSetPoint));
  }

  getMode(callback) {
    this.logger.info(`Getting Heating Cooling Mode - Device says: ${this.device.mode}`);
    callback(null, this.device.mode);
  }

  getOperatingMode(callback) {
    this.logger.info(`Getting Heating Cooling State - Device says: ${this.device.operatingMode}`);
    callback(null, this.device.operatingMode);
  }

  getFanMode(callback) {
    this.logger.info(`Getting Fan State - Device says: ${this.device.fanMode}`);
    callback(null, this.device.fanMode);
  }

  getHumidity(callback) {
    this.logger.info(`Getting Current Rel. Humidity - Device says: ${this.device.humidity}`);
    callback(null, this.device.humidity);
  } // Mirrors change in the state of the underlying isy-nodejs device object.


  handlePropertyChange(propertyName, value, oldValue, formattedValue) {
    super.handlePropertyChange(propertyName, value, oldValue, formattedValue);

    switch (propertyName) {
      case isy_nodejs_1.Props.Climate.Temperature:
        this.primaryService.getCharacteristic(hap_nodejs_1.Characteristic.CurrentTemperature).updateValue(this.toCelsius(this.device.currentTemperature));
        break;

      case isy_nodejs_1.Props.Climate.CoolSetPoint:
        this.primaryService.getCharacteristic(hap_nodejs_1.Characteristic.CoolingThresholdTemperature).updateValue(this.toCelsius(this.device.coolSetPoint));
        break;

      case isy_nodejs_1.Props.Climate.HeatSetPoint:
        this.primaryService.getCharacteristic(hap_nodejs_1.Characteristic.CoolingThresholdTemperature).updateValue(this.toCelsius(this.device.heatSetPoint));
        break;

      case isy_nodejs_1.Props.Climate.OperatingMode:
        this.primaryService.getCharacteristic(hap_nodejs_1.Characteristic.CurrentHeatingCoolingState).updateValue(this.device.operatingMode);
        break;

      case isy_nodejs_1.Props.Climate.Mode:
        this.primaryService.getCharacteristic(hap_nodejs_1.Characteristic.TargetHeatingCoolingState).updateValue(this.device.mode);
        break;

      case isy_nodejs_1.Props.Climate.FanMode:
        this.primaryService.getCharacteristic(hap_nodejs_1.Characteristic.CurrentFanState).updateValue(this.device.fanMode);
        break;

      case isy_nodejs_1.Props.Climate.Humidity:
        this.primaryService.getCharacteristic(hap_nodejs_1.Characteristic.CurrentRelativeHumidity).updateValue(this.device.humidity);
        break;

      default:
        break;
    }
  }

  setupServices() {
    super.setupServices();
    this.primaryService = this.addService(hap_nodejs_1.Service.Thermostat); // primaryService.getCharacteristic(Characteristic.TargetTemperature).on("get", this.getTargetTemperature.bind(this));
    // primaryService.getCharacteristic(Characteristic.TargetTemperature).on("set", this.setTargetTemperature.bind(this));

    this.primaryService.setCharacteristic(hap_nodejs_1.Characteristic.TemperatureDisplayUnits, 1);
    this.primaryService.addCharacteristic(hap_nodejs_1.Characteristic.CurrentFanState);
    this.primaryService.getCharacteristic(hap_nodejs_1.Characteristic.CurrentFanState).on("get"
    /* GET */
    , f => this.getFanMode(f));
    this.primaryService.getCharacteristic(hap_nodejs_1.Characteristic.CurrentTemperature).on("get"
    /* GET */
    , this.getCurrentTemperature.bind(this));
    this.primaryService.getCharacteristic(hap_nodejs_1.Characteristic.CoolingThresholdTemperature).on("get"
    /* GET */
    , this.getCoolSetPoint.bind(this));
    this.primaryService.getCharacteristic(hap_nodejs_1.Characteristic.CoolingThresholdTemperature).on("set"
    /* SET */
    , this.setCoolSetPoint.bind(this));
    this.primaryService.getCharacteristic(hap_nodejs_1.Characteristic.HeatingThresholdTemperature).on("get"
    /* GET */
    , this.getHeatSetPoint.bind(this));
    this.primaryService.getCharacteristic(hap_nodejs_1.Characteristic.HeatingThresholdTemperature).on("set"
    /* SET */
    , this.setHeatSetPoint.bind(this));
    this.primaryService.getCharacteristic(hap_nodejs_1.Characteristic.CurrentHeatingCoolingState).on("get"
    /* GET */
    , this.getOperatingMode.bind(this));
    this.primaryService.getCharacteristic(hap_nodejs_1.Characteristic.TargetHeatingCoolingState).on("get"
    /* GET */
    , this.getMode.bind(this));
    this.primaryService.getCharacteristic(hap_nodejs_1.Characteristic.TargetHeatingCoolingState).on("set"
    /* SET */
    , this.setHeatingCoolingMode.bind(this));
    this.primaryService.getCharacteristic(hap_nodejs_1.Characteristic.CurrentRelativeHumidity).on("get"
    /* GET */
    , this.getHumidity.bind(this)); // primaryService
    //   .getCharacteristic(Characteristic.RotationSpeed)
    //   .on(CharacteristicEventTypes.SET, this.setThermostatRotationSpeed.bind(this));
  }

  setCoolSetPoint(temp, callback) {
    this.logger.info(`Sending command to set cool set point (pre-translate) to: ${temp}`);
    const newSetPoint = this.toFahrenheit(temp);
    this.logger.info(`Sending command to set cool set point to: ${newSetPoint}`);

    if (Math.abs(newSetPoint - this.device.coolSetPoint) >= 1) {
      this.device.updateCoolSetPoint(newSetPoint).handleWith(callback);
    } else {
      this.logger.info(`Command does not change actual set point`);
      callback();
    }
  }

  setHeatSetPoint(temp, callback) {
    this.logger.info(`Sending command to set heat set point (pre-translate) to: ${temp}`);
    const newSetPoint = this.toFahrenheit(temp);
    this.logger.info(`Sending command to set heat set point to: ${newSetPoint}`);

    if (Math.abs(newSetPoint - this.device.heatSetPoint) >= 1) {
      this.device.updateHeatSetPoint(newSetPoint).handleWith(callback);
    } else {
      this.logger.info(`Command does not change actual set point`);
      callback();
    }
  }

  setHeatingCoolingMode(mode, callback) {
    this.logger.info(`Sending command to set heating/cooling mode (pre-translate) to: ${mode}`); // this.logger.info("THERM: " + this.device.name + " Sending command to set cool set point to: " + newSetPoint);

    if (mode !== this.device.mode) {
      this.device.updateMode(mode).handleWith(callback);
    } else {
      this.logger.info(`Command does not change actual mode`);
      callback();
    }
  }

}

exports.ISYThermostatAccessory = ISYThermostatAccessory;