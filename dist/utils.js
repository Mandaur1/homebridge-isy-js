var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var HAPNodeJS = require("hap-nodejs");
var characteristic = require("hap-nodejs/dist/lib/Characteristic");
// tslint:disable-next-line: no-namespace
// tslint:disable-next-line: no-namespace
function onSet(character, func) {
    var cfunc = addSetCallback(func);
    return character.on(HAPNodeJS.CharacteristicEventTypes.SET, cfunc);
}
exports.onSet = onSet;
// export function onGetAsync<T>(character: characteristic.Characteristic, func: (arg: HAPNodeJS.CharacteristicValue) => Promise<T>): characteristic.Characteristic {
// 	const cfunc = addGetCallback(func)
// 	return character.on(HAPNodeJS.CharacteristicEventTypes.GET, cfunc);
// }
function onGet(character, func) {
    var cfunc = function (cb) {
        cb(null, func());
    };
    return character.on(HAPNodeJS.CharacteristicEventTypes.GET, cfunc);
}
exports.onGet = onGet;
/* export interface Characteristic {

on(eventType: CharacteristicEventTypes, func: (...args) => void): Characteristic;
onSet<T>(characteristic: Characteristic, func: (...args) => Promise<T>): Characteristic;
onGet<T>(characteristic: Characteristic, func: (...args) => Promise<T>): Characteristic;
}
} */
(characteristic.Characteristic.prototype).onSet = function (func) {
    var c = this;
    return onSet(c, func);
};
(characteristic.Characteristic.prototype).onGet = function (func) {
    var c = this;
    return onGet(c, func);
};
// (service.Service.prototype as any).changeCharacteristic = (name: HAPNodeJS.WithUUID<typeof HAPNodeJS.Characteristic>, value: HAPNodeJS.CharacteristicValue) => {
// 	const t = this as unknown as service.Service;
// 	t.getCharacteristic(name).updateValue(value);
// };
Promise.prototype.handleWith = function (callback) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, this.then(function (value) {
                    callback(null, value);
                }).catch(function (msg) {
                    callback(new Error(msg), msg);
                })];
        });
    });
};
function addGetCallback(func) {
    return function (arg, cb) {
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
    return function (arg, cb) {
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
    return function (arg, cb) {
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
