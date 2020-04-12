Object.defineProperty(exports, "__esModule", { value: true });
const hap_nodejs_1 = require("hap-nodejs");
const Characteristic_1 = require("hap-nodejs/dist/lib/Characteristic");
const logger_1 = require("homebridge/lib/logger");
// import * as service from 'homebridge/node_modules/homebridge/node_modules/hap-nodejs/dist/lib/Service';
exports.didFinishLaunching = Symbol('didFinishLaunching');
// tslint:disable-next-line: no-namespace
// tslint:disable-next-line: no-namespace
function onSet(character, func) {
    const cfunc = addSetCallback(func);
    return character.on(hap_nodejs_1.CharacteristicEventTypes.SET, cfunc);
}
exports.onSet = onSet;
function toCelsius(temp) {
    return ((temp - 32.0) * 5.0) / 9.0;
}
exports.toCelsius = toCelsius;
function toFahrenheit(temp) {
    return Math.round((temp * 9.0) / 5.0 + 32.0);
}
exports.toFahrenheit = toFahrenheit;
// export function onGetAsync<T>(character: characteristic.Characteristic, func: (arg: CharacteristicValue) => Promise<T>): characteristic.Characteristic {
// 	const cfunc = addGetCallback(func)
// 	return character.on(CharacteristicEventTypes.GET, cfunc);
// }
function onGet(character, func) {
    const cfunc = (cb) => {
        cb(null, func());
    };
    return character.on(hap_nodejs_1.CharacteristicEventTypes.GET, cfunc);
}
exports.onGet = onGet;
/* export interface Characteristic {

on(eventType: CharacteristicEventTypes, func: (...args) => void): Characteristic;
onSet<T>(characteristic: Characteristic, func: (...args) => Promise<T>): Characteristic;
onGet<T>(characteristic: Characteristic, func: (...args) => Promise<T>): Characteristic;
}
} */
(Characteristic_1.Characteristic.prototype).onSet = function (func) {
    const c = this;
    return onSet(c, func);
};
// tslint:disable-next-line: only-arrow-functions
(logger_1.Logger.prototype).trace = (...msg) => {
    const log = this;
    // onst newMsg = chalk.dim(msg);
    if (log.isTraceEnabled()) {
        log.log.apply(this, ['trace'].concat(msg));
    }
};
(logger_1.Logger.prototype).fatal = (...msg) => {
    var _a;
    const log = this;
    // const newMsg = chalk.dim(msg);
    if ((_a = log) === null || _a === void 0 ? void 0 : _a.isFatalEnabled()) {
        log.error(msg[0], msg.shift());
    }
};
(logger_1.Logger.prototype).isDebugEnabled = () => true;
(logger_1.Logger.prototype).isErrorEnabled = () => true;
(logger_1.Logger.prototype).isWarnEnabled = () => true;
(logger_1.Logger.prototype).isFatalEnabled = () => true;
(logger_1.Logger.prototype).isTraceEnabled = () => true;
(logger_1.Logger.prototype).call = (msg) => {
    const l = this;
    l.info(msg);
};
(Characteristic_1.Characteristic.prototype).onGet = function (func) {
    const c = this;
    return onGet(c, func);
};
// (service.Service.prototype as any).changeCharacteristic = (name: WithUUID<typeof Characteristic>, value: CharacteristicValue) => {
// 	const t = this as unknown as service.Service;
// 	t.getCharacteristic(name).updateValue(value);
// };
Promise.prototype.handleWith = async function (callback) {
    return this.then((value) => {
        callback(null, value);
    }).catch((msg) => {
        callback(new Error(msg), msg);
    });
};
function addGetCallback(func) {
    return (arg, cb) => {
        // assumption is function has signature of (val, callback, args..)
        try {
            func(arg).handleWith(cb);
        }
        catch (_a) {
            throw new Error('Last argument of callback is not a function.');
        }
    };
}
exports.addGetCallback = addGetCallback;
function addSetCallback(func) {
    return (arg, cb) => {
        // assumption is function has signature of (val, callback, args..)
        // const n = newArgs[1];
        try {
            func(arg).handleWith(cb);
        }
        catch (_a) {
            throw new Error('Last argument of callback is not a function.');
        }
    };
}
exports.addSetCallback = addSetCallback;
function addCallback(func) {
    return (arg, cb) => {
        // assumption is function has signature of (val, callback, args..)
        console.log('entering new function');
        console.log(arg);
        // const n = newArgs[1];
        try {
            console.log(func);
            console.log(cb);
            func(arg).handleWith(cb);
        }
        catch (_a) {
            throw new Error('Last argument of callback is not a function.');
        }
    };
}
exports.addCallback = addCallback;
//# sourceMappingURL=utils.js.map