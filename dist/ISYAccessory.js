var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var hap_nodejs_1 = require("hap-nodejs");
var HomeKit_1 = require("hap-nodejs/dist/lib/gen/HomeKit");
var uuid_1 = require("hap-nodejs/dist/lib/util/uuid");
var isy_js_1 = require("isy-js");
var ISYAccessory = /** @class */ (function (_super) {
    __extends(ISYAccessory, _super);
    function ISYAccessory(log, device) {
        var _this = this;
        var s = uuid_1.generate(device.isy.address + ":" + device.address + "1");
        _this = _super.call(this, device.displayName, s) || this;
        _this.uuid_base = s;
        _this.name = device.displayName;
        // super(device.name,hapNodeJS.uuid.generate(device.isy.address + ":" + device.address))
        _this.logger = function (msg) {
            log("Accessory " + device.name + ": " + msg);
        };
        _this.device = device;
        _this.address = device.address;
        _this.device.onPropertyChanged(null, _this.handleExternalChange.bind(_this));
        return _this;
    }
    ISYAccessory.prototype.getServices = function () {
        this.informationService = this.getService(HomeKit_1.AccessoryInformation);
        if (!this.informationService) {
            this.logger('information service needs to be created');
            this.informationService = this.addService(hap_nodejs_1.Service.AccessoryInformation);
        }
        this.informationService
            .setCharacteristic(hap_nodejs_1.Characteristic.Manufacturer, 'Insteon')
            .setCharacteristic(hap_nodejs_1.Characteristic.Model, this.device.productName === undefined ? this.device.name : this.device.productName)
            .setCharacteristic(hap_nodejs_1.Characteristic.SerialNumber, this.device.modelNumber)
            .setCharacteristic(hap_nodejs_1.Characteristic.FirmwareRevision, this.device.version);
        return [this.informationService];
    };
    ISYAccessory.prototype.handleExternalChange = function (propertyName, value, formattedValue) {
        var name = propertyName in isy_js_1.Controls ? isy_js_1.Controls[propertyName].label : propertyName;
        this.logger("Incoming update to " + name + ". Device says: " + this.device[propertyName] + " (" + formattedValue + ")");
    };
    ISYAccessory.prototype.convertToHK = function (propertyName, value) {
        return value;
    };
    ISYAccessory.prototype.identify = function (callback) {
        // Do the identify action
        callback();
    };
    return ISYAccessory;
}(hap_nodejs_1.Accessory));
exports.ISYAccessory = ISYAccessory;
