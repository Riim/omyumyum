(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.omyumyum = {}));
}(this, (function (exports) { 'use strict';

	const KEY_STATE = Symbol('state');

	const isNonZeroLength = (obj) => obj.length != 0;
	const isNonZeroSize = (obj) => obj.size != 0;
	// istanbul ignore next
	const findLast = (arr, cb) => {
	    let index = arr.length - 1;
	    if (index >= 0) {
	        for (;; index--) {
	            if (cb(arr[index], index)) {
	                return arr[index];
	            }
	            if (index == 0) {
	                break;
	            }
	        }
	    }
	    return;
	};

	const validationState = {
	    errorMessage: null,
	    errorTypes: null,
	    errorKeypatch: null,
	    currentKeypath: ''
	};

	const check = (state, value) => state.validators.some((validators) => checkCallback(state, validators, value));
	const checkCallback = (state, validators, value) => validators.every((validator) => checkCallbackCallback(state, validator, value));
	const checkCallbackCallback = (state, validator, value) => {
	    let result = validator.validator(value);
	    if (validationState.errorMessage || validationState.errorTypes) {
	        return result;
	    }
	    if (typeof result == 'string') {
	        validationState.errorMessage = result;
	        return false;
	    }
	    if (!result) {
	        if (validator.message) {
	            validationState.errorMessage = validator.message;
	        }
	        let errorTypes = state.validators.map((validators) => { var _a; return (_a = findLast(validators, (validator) => validator.type)) === null || _a === void 0 ? void 0 : _a.type; });
	        if (errorTypes.every(Boolean)) {
	            validationState.errorTypes = errorTypes;
	        }
	    }
	    return result;
	};

	function addValidator(type, andMode, validator, typeProto = type.__proto__) {
	    if (type[KEY_STATE].notMode) {
	        validator = {
	            validator: ((validator) => (value) => !validator(value))(validator.validator),
	            message: validator.message,
	            type: validator.type
	        };
	    }
	    let newType = ((value) => check(newType[KEY_STATE], value));
	    newType.__proto__ = typeProto;
	    let validators = type[KEY_STATE].validators.slice();
	    if (andMode) {
	        let validators_ = (validators[validators.length - 1] =
	            validators[validators.length - 1].slice());
	        if (Array.isArray(validator)) {
	            validators_.push(...validator);
	        }
	        else {
	            validators_.push(validator);
	        }
	    }
	    else {
	        validators.push(Array.isArray(validator) ? validator : [validator]);
	    }
	    newType[KEY_STATE] = {
	        validators,
	        notMode: false,
	        andMode: false
	    };
	    return newType;
	}

	const typeProto = {
	    __proto__: Function.prototype,
	    [KEY_STATE]: null,
	    isOmYumYum: true,
	    get and() {
	        return {
	            __proto__: typesProto,
	            [KEY_STATE]: {
	                validators: this[KEY_STATE].validators,
	                notMode: false,
	                andMode: true
	            }
	        };
	    },
	    get or() {
	        return { __proto__: typesProto, [KEY_STATE]: this[KEY_STATE] };
	    },
	    allow(value) {
	        return addValidator(this, false, { validator: (val) => Object.is(val, value) }, typeProto);
	    },
	    notAllow(value) {
	        return addValidator(this, true, { validator: (val) => !Object.is(val, value) }, typeProto);
	    },
	    oneOf(values) {
	        return addValidator(this, true, { validator: (val) => values.includes(val) }, typeProto);
	    },
	    notOneOf(values) {
	        return addValidator(this, true, { validator: (val) => !values.includes(val) }, typeProto);
	    }
	};

	function arrayOfCallback(item, index) {
	    let prevKeypath = validationState.currentKeypath;
	    validationState.currentKeypath = validationState.currentKeypath + `[${index}]`;
	    let result = this(item);
	    if (!result && !validationState.errorKeypatch) {
	        validationState.errorKeypatch = validationState.currentKeypath;
	    }
	    validationState.currentKeypath = prevKeypath;
	    return result;
	}
	const arrayTypeProto = {
	    __proto__: typeProto,
	    of(validator) {
	        return addValidator(this, true, {
	            validator: (arr) => arr.every(arrayOfCallback, validator)
	        });
	    },
	    len(value) {
	        return addValidator(this, true, {
	            validator: (arr) => arr.length == value
	        });
	    },
	    minLen(value) {
	        return addValidator(this, true, {
	            validator: (arr) => arr.length >= value
	        });
	    },
	    maxLen(value) {
	        return addValidator(this, true, {
	            validator: (arr) => arr.length <= value
	        });
	    },
	    get nonEmpty() {
	        return addValidator(this, true, { validator: isNonZeroLength });
	    }
	};

	const dateTypeProto = {
	    __proto__: typeProto,
	    earlier(earlierThanDate) {
	        return addValidator(this, true, {
	            validator: (date) => date < new Date(earlierThanDate)
	        });
	    },
	    later(laterThanDate) {
	        return addValidator(this, true, {
	            validator: (date) => date > new Date(laterThanDate)
	        });
	    },
	    before(beforeDate) {
	        return this.earlier(beforeDate);
	    },
	    after(afterDate) {
	        return this.later(afterDate);
	    }
	};

	const mapTypeProto = {
	    __proto__: typeProto,
	    keys(validator) {
	        return addValidator(this, true, {
	            validator: (map) => {
	                for (let [key] of map) {
	                    let prevKeypath = validationState.currentKeypath;
	                    validationState.currentKeypath = validationState.currentKeypath + `[${key}]`;
	                    if (!validator(key)) {
	                        if (!validationState.errorKeypatch) {
	                            validationState.errorKeypatch = validationState.currentKeypath;
	                        }
	                        validationState.currentKeypath = prevKeypath;
	                        return false;
	                    }
	                    validationState.currentKeypath = prevKeypath;
	                }
	                return true;
	            }
	        });
	    },
	    values(validator) {
	        return addValidator(this, true, {
	            validator: (map) => {
	                for (let [key, value] of map) {
	                    let prevKeypath = validationState.currentKeypath;
	                    validationState.currentKeypath = validationState.currentKeypath + `[${key}]`;
	                    if (!validator(value)) {
	                        if (!validationState.errorKeypatch) {
	                            validationState.errorKeypatch = validationState.currentKeypath;
	                        }
	                        validationState.currentKeypath = prevKeypath;
	                        return false;
	                    }
	                    validationState.currentKeypath = prevKeypath;
	                }
	                return true;
	            }
	        });
	    },
	    get nonEmpty() {
	        return addValidator(this, true, { validator: isNonZeroSize });
	    }
	};

	const isInteger = (num) => Number.isInteger(num);
	const numberTypeProto = {
	    __proto__: typeProto,
	    lt(value) {
	        return addValidator(this, true, { validator: (num) => num < value });
	    },
	    less(value) {
	        return this.lt(value);
	    },
	    lte(value) {
	        return addValidator(this, true, { validator: (num) => num <= value });
	    },
	    max(value) {
	        return this.lte(value);
	    },
	    gt(value) {
	        return addValidator(this, true, { validator: (num) => num > value });
	    },
	    greater(value) {
	        return this.gt(value);
	    },
	    gte(value) {
	        return addValidator(this, true, { validator: (num) => num >= value });
	    },
	    min(value) {
	        return this.gte(value);
	    },
	    inRange(minValue, maxValue) {
	        return this.gte(minValue).lte(maxValue);
	    },
	    between(minValue, maxValue) {
	        return this.inRange(minValue, maxValue);
	    },
	    get positive() {
	        return this.gte(0);
	    },
	    get negative() {
	        return this.lt(0);
	    },
	    get integer() {
	        return addValidator(this, true, { validator: isInteger });
	    }
	};

	const hasOwn = Object.prototype.hasOwnProperty;
	function objectShapeCallback(entry) {
	    let [key, validator] = entry;
	    let prevKeypath = validationState.currentKeypath;
	    validationState.currentKeypath =
	        validationState.currentKeypath + (validationState.currentKeypath ? '.' : '') + key;
	    let result = validator(this[key]);
	    if (!result && !validationState.errorKeypatch) {
	        validationState.errorKeypatch = validationState.currentKeypath;
	    }
	    validationState.currentKeypath = prevKeypath;
	    return result;
	}
	function objectKeysCallback(key) {
	    return this.test(key);
	}
	function objectValuesCallback(entry) {
	    let [key, value] = entry;
	    let prevKeypath = validationState.currentKeypath;
	    validationState.currentKeypath =
	        validationState.currentKeypath + (validationState.currentKeypath ? '.' : '') + key;
	    let result = this(value);
	    if (!result && !validationState.errorKeypatch) {
	        validationState.errorKeypatch = validationState.currentKeypath;
	    }
	    validationState.currentKeypath = prevKeypath;
	    return result;
	}
	const objectTypeProto = {
	    __proto__: typeProto,
	    shape(shape, exact) {
	        let validators = [];
	        if (exact) {
	            let shapeKeys = Object.keys(shape);
	            let hasKey = (key) => shapeKeys.includes(key);
	            validators.push({
	                validator: (obj) => Object.keys(obj).every(hasKey),
	                message: 'Invalid object shape'
	            });
	        }
	        let shapeEntries = Object.entries(shape);
	        validators.push({
	            validator: (obj) => shapeEntries.every(objectShapeCallback, obj)
	        });
	        return addValidator(this, true, validators);
	    },
	    exactShape(shape) {
	        return this.shape(shape, true);
	    },
	    keys(re) {
	        return addValidator(this, true, {
	            validator: (obj) => Object.keys(obj).every(objectKeysCallback, re)
	        });
	    },
	    values(validator) {
	        return addValidator(this, true, {
	            validator: (obj) => Object.entries(obj).every(objectValuesCallback, validator)
	        });
	    },
	    get nonEmpty() {
	        return addValidator(this, true, {
	            validator: (obj) => {
	                for (let key in obj) {
	                    if (hasOwn.call(obj, key)) {
	                        return true;
	                    }
	                }
	                return false;
	            }
	        });
	    }
	};

	const setTypeProto = {
	    __proto__: typeProto,
	    of(validator) {
	        return addValidator(this, true, {
	            validator: (set) => {
	                let index = 0;
	                for (let item of set) {
	                    let prevKeypath = validationState.currentKeypath;
	                    validationState.currentKeypath =
	                        validationState.currentKeypath + `[${index++}]`;
	                    if (!validator(item)) {
	                        if (!validationState.errorKeypatch) {
	                            validationState.errorKeypatch = validationState.currentKeypath;
	                        }
	                        validationState.currentKeypath = prevKeypath;
	                        return false;
	                    }
	                    validationState.currentKeypath = prevKeypath;
	                }
	                return true;
	            }
	        });
	    },
	    get nonEmpty() {
	        return addValidator(this, true, { validator: isNonZeroSize });
	    }
	};

	const isNonEmpty = (str) => /\S/.test(str);
	const stringTypeProto = {
	    __proto__: typeProto,
	    len(value) {
	        return addValidator(this, true, { validator: (str) => str.length == value });
	    },
	    minLen(value) {
	        return addValidator(this, true, {
	            validator: (str) => str.length >= value
	        });
	    },
	    maxLen(value) {
	        return addValidator(this, true, {
	            validator: (str) => str.length <= value
	        });
	    },
	    pattern(re) {
	        return addValidator(this, true, { validator: (str) => re.test(str) });
	    },
	    matches(re) {
	        return this.pattern(re);
	    },
	    startsWith(searchString, position) {
	        return addValidator(this, true, {
	            validator: (str) => str.startsWith(searchString, position)
	        });
	    },
	    endsWith(searchString, position) {
	        return addValidator(this, true, {
	            validator: (str) => str.endsWith(searchString, position)
	        });
	    },
	    get nonZero() {
	        return addValidator(this, true, { validator: isNonZeroLength });
	    },
	    get nonEmpty() {
	        return addValidator(this, true, { validator: isNonEmpty });
	    }
	};

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
	const typesProto = {
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

	function OmYumYum(validator, value) {
	    var _a;
	    if (arguments.length == 1) {
	        return (value) => {
	            return OmYumYum(validator, value);
	        };
	    }
	    validationState.errorMessage = null;
	    validationState.errorTypes = null;
	    validationState.errorKeypatch = null;
	    if (!validator(value)) {
	        throw TypeError(((_a = validationState.errorMessage) !== null && _a !== void 0 ? _a : (validationState.errorTypes
	            ? `Expected type "${validationState.errorTypes.join('" or "')}"`
	            : 'Type mismatch')) +
	            (validationState.errorKeypatch
	                ? validationState.errorMessage
	                    ? ` (at "${validationState.errorKeypatch}")`
	                    : ` at "${validationState.errorKeypatch}"`
	                : ''));
	    }
	    return value;
	}
	OmYumYum.__proto__ = typesProto;
	OmYumYum[KEY_STATE] = {
	    validators: [],
	    notMode: false,
	    andMode: false
	};
	const om = OmYumYum;

	exports.OmYumYum = OmYumYum;
	exports.default = om;
	exports.om = om;
	exports.typesProto = typesProto;

	Object.defineProperty(exports, '__esModule', { value: true });

})));
