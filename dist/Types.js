import { addValidator } from './addValidator';
import { KEY_STATE } from './constants';
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
const isNumber = (value) => typeof value == 'number' && Number.isFinite(value);
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
        return {
            __proto__: typesProto,
            [KEY_STATE]: Object.assign(Object.assign({}, this[KEY_STATE]), { notMode: true })
        };
    },
    custom(validator, _typeProto = typeProto) {
        return addValidator(this, this[KEY_STATE].andMode, typeof validator == 'function' ? { validator } : validator, _typeProto);
    },
    get null() {
        return this.custom({ validator: isNull, type: 'null' });
    },
    get undefined() {
        return this.custom({ validator: isUndefined, type: 'undefined' });
    },
    get vacuum() {
        return this.custom({ validator: isVacuum, type: 'vacuum' });
    },
    get boolean() {
        return this.custom({ validator: isBoolean, type: 'boolean' });
    },
    get number() {
        return this.custom({ validator: isNumber, type: 'number' }, numberTypeProto);
    },
    get string() {
        return this.custom({ validator: isString, type: 'string' }, stringTypeProto);
    },
    get symbol() {
        return this.custom({ validator: isSymbol, type: 'symbol' });
    },
    get object() {
        return this.custom({ validator: isObject, type: 'Object' }, objectTypeProto);
    },
    get array() {
        return this.custom({ validator: isArray, type: 'Array' }, arrayTypeProto);
    },
    get function() {
        return this.custom({ validator: isFunction, type: 'Function' });
    },
    get func() {
        return this.function;
    },
    get map() {
        return this.custom({ validator: isMap, type: 'Map' }, mapTypeProto);
    },
    get set() {
        return this.custom({ validator: isSet, type: 'Set' }, setTypeProto);
    },
    get weakMap() {
        return this.custom({ validator: isWeakMap, type: 'WeakMap' }, mapTypeProto);
    },
    get wmap() {
        return this.weakMap;
    },
    get weakSet() {
        return this.custom({ validator: isWeakSet, type: 'WeakSet' }, setTypeProto);
    },
    get wset() {
        return this.weakSet;
    },
    get date() {
        return this.custom({ validator: isDate, type: 'Date' }, dateTypeProto);
    },
    get regExp() {
        return this.custom({ validator: isRegExp, type: 'RegExp' });
    },
    get regex() {
        return this.regExp;
    },
    get promise() {
        return this.custom({ validator: isPromise, type: 'Promise' });
    },
    get error() {
        return this.custom({ validator: isError, type: 'Error' });
    }
};
