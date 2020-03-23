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
var ISYDeviceAccessory_1 = require("./ISYDeviceAccessory");
require("./utils");
var hap_nodejs_1 = require("hap-nodejs");
var ISYOutletAccessory = /** @class */ (function (_super) {
    __extends(ISYOutletAccessory, _super);
    function ISYOutletAccessory(log, device) {
        return _super.call(this, log, device) || this;
    }
    // Handles the identify command
    // Handles a request to set the outlet state. Ignores redundant sets based on current states.
    ISYOutletAccessory.prototype.setOutletState = function (outletState, callback) {
        this.logger("OUTLET: Sending command to set outlet state to: " + outletState);
        if (outletState !== this.device.isOn) {
            this.device
                .updateIsOn(outletState)
                .then(callback(true))
                .catch(callback(false));
        }
        else {
            callback();
        }
    };
    // Handles a request to get the current outlet state based on underlying isy-js device object.
    ISYOutletAccessory.prototype.getOutletState = function (callback) {
        callback(null, this.device.isOn);
    };
    // Handles a request to get the current in use state of the outlet. We set this to true always as
    // there is no way to deterine this through the isy.
    ISYOutletAccessory.prototype.getOutletInUseState = function (callback) {
        callback(null, true);
    };
    // Mirrors change in the state of the underlying isj-js device object.
    ISYOutletAccessory.prototype.handleExternalChange = function (propertyName, value, formattedValue) {
        _super.prototype.handleExternalChange.call(this, propertyName, value, formattedValue);
        this.outletService.updateCharacteristic(hap_nodejs_1.Characteristic.On, this.device.isOn);
    };
    // Returns the set of services supported by this object.
    ISYOutletAccessory.prototype.getServices = function () {
        _super.prototype.getServices.call(this);
        var outletService = this.addService(hap_nodejs_1.Service.Outlet);
        this.outletService = outletService;
        outletService.getCharacteristic(hap_nodejs_1.Characteristic.On).on(hap_nodejs_1.CharacteristicEventTypes.SET, this.setOutletState.bind(this));
        outletService.getCharacteristic(hap_nodejs_1.Characteristic.On).on(hap_nodejs_1.CharacteristicEventTypes.GET, this.getOutletState.bind(this));
        outletService.getCharacteristic(hap_nodejs_1.Characteristic.OutletInUse).on(hap_nodejs_1.CharacteristicEventTypes.GET, this.getOutletInUseState.bind(this));
        return [this.informationService, outletService];
    };
    return ISYOutletAccessory;
}(ISYDeviceAccessory_1.ISYDeviceAccessory));
exports.ISYOutletAccessory = ISYOutletAccessory;
