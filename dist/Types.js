import { KEY_STATE } from './constants';
import { addTypeValidators } from './types/addTypeValidators';
import { arrayTypeProto } from './types/ArrayType';
import { dateTypeProto } from './types/DateType';
import { mapTypeProto } from './types/MapType';
import { numberTypeProto } from './types/NumberType';
import { objectTypeProto } from './types/ObjectType';
import { setTypeProto } from './types/SetType';
import { stringTypeProto } from './types/StringType';
import { typeProto } from './types/Type';
const isNull = (value) => value === null;
const isUndefined = (value) => value === undefined;
const isVacuum = (value) => value == null;
const isBoolean = (value) => typeof value == 'boolean';
const isNumber = (value) => typeof value == 'number' && Number.isFinite(value) && !Number.isNaN(value);
const isString = (value) => typeof value == 'string';
const isSymbol = (value) => typeof value == 'symbol';
const isObject = (value) => value === Object(value);
const isArray = Array.isArray;
const isFunction = (value) => typeof value == 'function';
const isSet = (value) => value instanceof Set;
const isMap = (value) => value instanceof Map;
const isWeakSet = (value) => value instanceof WeakSet;
const isWeakMap = (value) => value instanceof WeakMap;
const isDate = (value) => value instanceof Date;
const isRegExp = (value) => value instanceof RegExp;
const isPromise = (value) => value instanceof Promise;
const isError = (value) => value instanceof Error;
export const typesProto = {
    [KEY_STATE]: null,
    get not() {
        let types = {
            __proto__: typesProto,
            [KEY_STATE]: Object.assign(Object.assign({}, this[KEY_STATE]), { notMode: true })
        };
        return types;
    },
    custom(validator, _typeProto = typeProto) {
        return addTypeValidators(this, this[KEY_STATE].andMode, validator, _typeProto);
    },
    get null() {
        return this.custom(isNull);
    },
    get undefined() {
        return this.custom(isUndefined);
    },
    get vacuum() {
        return this.custom(isVacuum);
    },
    get boolean() {
        return this.custom(isBoolean);
    },
    get number() {
        return this.custom(isNumber, numberTypeProto);
    },
    get string() {
        return this.custom(isString, stringTypeProto);
    },
    get symbol() {
        return this.custom(isSymbol);
    },
    get object() {
        return this.custom(isObject, objectTypeProto);
    },
    get array() {
        return this.custom(isArray, arrayTypeProto);
    },
    get function() {
        return this.custom(isFunction);
    },
    get func() {
        return this.function;
    },
    get map() {
        return this.custom(isMap, mapTypeProto);
    },
    get set() {
        return this.custom(isSet, setTypeProto);
    },
    get weakMap() {
        return this.custom(isWeakMap, mapTypeProto);
    },
    get wmap() {
        return this.weakMap;
    },
    get weakSet() {
        return this.custom(isWeakSet, setTypeProto);
    },
    get wset() {
        return this.weakSet;
    },
    get date() {
        return this.custom(isDate, dateTypeProto);
    },
    get regExp() {
        return this.custom(isRegExp);
    },
    get regex() {
        return this.regExp;
    },
    get promise() {
        return this.custom(isPromise);
    },
    get error() {
        return this.custom(isError);
    }
};
