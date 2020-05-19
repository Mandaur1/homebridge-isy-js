"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addCallback = exports.addSetCallback = exports.addGetCallback = exports.wire = exports.clone = exports.onGet = exports.toFahrenheit = exports.toCelsius = exports.onSet = exports.cleanConfig = exports.isMatch = exports.Hap = exports.didFinishLaunching = void 0;
const isy_nodejs_1 = require("isy-nodejs");
const ISYPlatform_1 = require("./ISYPlatform");
// import * as service from 'homebridge/node_modules/homebridge/node_modules/hap-nodejs/dist/lib/Service';
exports.didFinishLaunching = Symbol('didFinishLaunching');
function isMatch(device, filter) {
    if (filter.lastAddressDigit) {
        if (!device.address.endsWith(filter.lastAddressDigit)) {
            return false;
        }
    }
    if (filter.name) {
        return device.name.includes(filter.name.trim());
    }
    if (filter.folder) {
        return device.folder.trim().toUpperCase() === filter.folder.trim().toUpperCase();
    }
    if (filter.nodeDef) {
        return device.nodeDefId.includes(filter.nodeDef);
    } /*to support _ADV variants*/
    if (filter.family) {
        // console.log(typeof filter.family, filter.family, typeof Family[filter.family]);
        // console.log(typeof device.family, device.family, typeof Family[device.family]);
        const t = isy_nodejs_1.Family[device.family] === filter.family;
        // console.log(t);
        return t;
    }
    if (filter.typeCode) {
        if (device instanceof isy_nodejs_1.ISYDevice) {
            return device.typeCode.includes(filter.typeCode);
        }
    }
    if (filter.address) {
        return device.address.includes(filter.address);
    }
    return false;
}
exports.isMatch = isMatch;
function cleanConfig(config) {
    if (!config.devices) {
        config.devices = [];
    }
    if (!config.includeAllScenes && config.includeAllScenes !== undefined) {
        if (config.includedScenes) {
            for (const i of config.includedScenes) {
                config.devices.push({
                    filter: {
                        name: i,
                        filterType: 'name',
                    },
                    exclude: false,
                });
            }
        }
        config.devices.push({
            filter: {
                // tslint:disable-next-line: quotemark
                filterType: 'family',
                family: 'Scene',
            },
            exclude: true,
        });
    }
    if (config.ignoreDevices) {
        for (const i of config.ignoreDevices) {
            const l = {
                filter: {},
                exclude: true,
            };
            if (i.nameContains && i.nameContains !== '') {
                l.filter.name = i.nameContains;
                l.filter.filterType = 'name';
            }
            else if (i.address && i.address !== '') {
                l.filter.address = i.address;
                l.filter.filterType = 'address';
            }
            else if (i.folder && i.folder !== '') {
                l.filter.folder = i.folder;
                l.filter.filterType = 'folder';
            }
            else if (i.family && i.family !== '') {
                l.filter.family = isy_nodejs_1.Family[i.family];
                l.filter.filterType = 'family';
            }
            else if (i.nodeDef && i.nodeDef !== '') {
                l.filter.nodeDef = i.nodeDef;
                l.filter.filterType = 'nodeDef';
            }
            else if (i.typeCode && i.typeCode !== '') {
                l.filter.typeCode = i.typeCode;
                l.filter.filterType = 'typeCode';
            }
            if (i.lastAddressDigit && i.lastAddressDigit !== '') {
                l.filter.lastAddressDigit = i.lastAddressDigit.toString();
            }
            config.devices.push(l);
        }
        config.ignoreDevices = undefined;
    }
    if (config.renameDevices) {
        for (const i of config.renameDevices) {
            const r = {
                filter: {},
                exclude: false,
                newName: i.newName,
            };
            if (i.name && i.name !== '') {
                r.filter.name = i.name;
                r.filter.filterType = 'name';
            }
            else if (i.address && i.address !== '') {
                r.filter.address = i.address;
                r.filter.filterType = 'address';
            }
            r.exclude = false;
            r.newName = i.newName;
            config.devices.push(r);
        }
        config.renameDevices = undefined;
    }
    return config;
}
exports.cleanConfig = cleanConfig;
// tslint:disable-next-line: no-namespace
// tslint:disable-next-line: no-namespace
function onSet(character, func) {
    const cfunc = addSetCallback(func);
    return character.on("set" /* SET */, cfunc);
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
    return character.on("get" /* GET */, cfunc);
}
exports.onGet = onGet;
function clone(logger, prefix) {
    const copy1 = { ...logger };
    copy1.prefix = copy1.prefix = prefix !== null && prefix !== void 0 ? prefix : logger.prototype;
    const copy = logger.info.bind(copy1);
    Object.assign(copy, logger);
    copy.prefix = prefix !== null && prefix !== void 0 ? prefix : logger.prefix;
    copy.isDebugEnabled = () => ISYPlatform_1.ISYPlatform.Instance.debugLoggingEnabled;
    copy.isErrorEnabled = () => true;
    copy.isWarnEnabled = () => true;
    copy.isFatalEnabled = () => true;
    copy.isTraceEnabled = () => true;
    // copy._log = logger._log.bind(copy);
    copy.debug = logger.debug.bind(copy);
    // copy.fatal = logger..bind(copy);
    copy.info = logger.info.bind(copy);
    copy.error = logger.error.bind(copy);
    copy.warn = logger.warn.bind(copy);
    copy.trace = ((message, ...args) => {
        // onst newMsg = chalk.dim(msg);
        if (copy.isTraceEnabled()) {
            copy.log.apply(this, ['trace'].concat(message).concat(args));
        }
    }).bind(copy);
    copy.fatal = ((message, ...args) => {
        // onst newMsg = chalk.dim(msg);
        if (logger.isFatalEnabled()) {
            logger.log.apply(this, ['fatal'].concat(message).concat(args));
        }
    }).bind(copy);
    return copy;
}
exports.clone = clone;
function wire(logger) {
    logger.isDebugEnabled = () => ISYPlatform_1.ISYPlatform.Instance.debugLoggingEnabled;
    logger.isErrorEnabled = () => true;
    logger.isWarnEnabled = () => true;
    logger.isFatalEnabled = () => true;
    logger.isTraceEnabled = () => true;
    logger.trace = ((message, ...args) => {
        // onst newMsg = chalk.dim(msg);
        if (logger.isTraceEnabled()) {
            logger.log.apply(this, ['trace'].concat(message).concat(args));
        }
    }).bind(logger);
    logger.fatal = ((message, ...args) => {
        // onst newMsg = chalk.dim(msg);
        if (logger.isFatalEnabled()) {
            logger.log.apply(this, ['fatal'].concat(message).concat(args));
        }
    }).bind(logger);
}
exports.wire = wire;
// tslint:disable-next-line: only-arrow-functions
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