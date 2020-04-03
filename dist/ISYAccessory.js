"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var hap_nodejs_1 = require("hap-nodejs");
var uuid_1 = require("hap-nodejs/dist/lib/util/uuid");
var logger_1 = require("homebridge/lib/logger");
var platformAccessory_1 = require("homebridge/lib/platformAccessory");
var isy_js_1 = require("isy-js");
var ISYAccessory = /** @class */ (function () {
    function ISYAccessory(device) {
        var s = uuid_1.generate(device.isy.address + ":" + device.address);
        ///super(device.displayName, s);
        this.UUID = s;
        this.name = device.name;
        this.displayName = device.displayName;
        // super(device.name,hapNodeJS.uuid.generate(device.isy.address + ":" + device.address))
        this.logger = new logger_1.Logger("ISY Device: " + this.name);
        this.device = device;
        this.address = device.address;
        //this.getServices();
        this.device.onPropertyChanged(null, this.handleExternalChange.bind(this));
    }
    // tslint:disable-next-line: ban-types
    ISYAccessory.prototype.bind = function (func) {
        return func.bind(this.device);
    };
    ISYAccessory.prototype.configure = function (accessory) {
        var _this = this;
        this.platformAccessory = (accessory !== null && accessory !== void 0 ? accessory : new platformAccessory_1.PlatformAccessory(this.displayName, this.UUID, this.category));
        var pa = this.platformAccessory;
        this.setupServices();
        pa.once('identify', function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            var _a;
            var a = pa._associatedHAPAccessory;
            _this.logger.debug('identify requested');
            (_a = a) === null || _a === void 0 ? void 0 : _a.setPrimaryService(a.services[1]);
            _this.identify(args[0]);
        });
    };
    ISYAccessory.prototype.setupServices = function () {
        var _a;
        this.informationService = this.platformAccessory.getOrAddService(hap_nodejs_1.Service.AccessoryInformation);
        if (!this.informationService) {
            this.logger.trace('information service needs to be created');
            this.informationService = this.platformAccessory.addService(hap_nodejs_1.Service.AccessoryInformation);
        }
        this.informationService
            .setCharacteristic(hap_nodejs_1.Characteristic.Manufacturer, isy_js_1.Family[this.device.family])
            .setCharacteristic(hap_nodejs_1.Characteristic.Model, (_a = this.device.productName, (_a !== null && _a !== void 0 ? _a : this.device.name)))
            .setCharacteristic(hap_nodejs_1.Characteristic.SerialNumber, this.device.modelNumber)
            .setCharacteristic(hap_nodejs_1.Characteristic.FirmwareRevision, this.device.version)
            .setCharacteristic(hap_nodejs_1.Characteristic.ProductData, this.device.address);
        return [this.informationService];
    };
    ISYAccessory.prototype.handleExternalChange = function (propertyName, value, formattedValue) {
        var name = propertyName in isy_js_1.Controls ? isy_js_1.Controls[propertyName].label : propertyName;
        this.logger.debug("Incoming update to " + name + ". Device says: " + value + " (" + formattedValue + ")");
    };
    ISYAccessory.prototype.convertToHK = function (propertyName, value) {
        return value;
    };
    ISYAccessory.prototype.identify = function (callback) {
        // Do the identify action
        callback();
    };
    return ISYAccessory;
}());
exports.ISYAccessory = ISYAccessory;
