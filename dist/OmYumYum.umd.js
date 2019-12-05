(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(global = global || self, factory(global.omyumyum = {}));
}(this, (function (exports) { 'use strict';

	const KEY_STATE = Symbol('state');

	const validationState = {
	    errorMessage: null,
	    errorTypes: [],
	    errorKeypatch: null,
	    currentKeypath: ''
	};

	const hasOwn = Object.prototype.hasOwnProperty;
	const check = (type, value) => type[KEY_STATE].validators.some(cb1, value);
	function cb1(validators) {
	    return validators.every(cb2, this);
	}
	function cb2(validator) {
	    let result = validator.validator(this);
	    if (result === true) {
	        validationState.errorTypes.length = 0;
	        return true;
	    }
	    if (typeof result == 'string') {
	        validationState.errorMessage = result;
	        return false;
	    }
	    if (result) {
	        validationState.errorTypes.length = 0;
	    }
	    else if (!validationState.errorMessage) {
	        if (validator.message && hasOwn.call(validator, 'message')) {
	            validationState.errorMessage = validator.message;
	        }
	        if (validator.type && hasOwn.call(validator, 'type')) {
	            validationState.errorTypes.push(validator.type);
	        }
	    }
	    return result;
	}

	function addTypeValidators(type, andMode, validator, typeProto) {
	    if (type[KEY_STATE].notMode) {
	        validator = {
	            validator: (validator => (value) => !validator(value))(validator.validator),
	            message: validator.message,
	            type: validator.type
	        };
	    }
	    let newType = ((value) => check(newType, value));
	    newType.__proto__ = typeProto || type.__proto__;
	    let validators = type[KEY_STATE].validators.slice();
	    if (andMode) {
	        let validators_ = (validators[validators.length - 1] = validators[validators.length - 1].slice());
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

	const isNonZeroLength = (obj) => obj.length != 0;
	const isNonZeroSize = (obj) => obj.size != 0;

	const typeProto = {
	    __proto__: Function.prototype,
	    [KEY_STATE]: null,
	    get and() {
	        let types = {
	            __proto__: typesProto,
	            [KEY_STATE]: {
	                validators: this[KEY_STATE].validators,
	                notMode: false,
	                andMode: true
	            }
	        };
	        return types;
	    },
	    get or() {
	        let types = { __proto__: typesProto, [KEY_STATE]: this[KEY_STATE] };
	        return types;
	    },
	    allow(value) {
	        return addTypeValidators(this, false, { validator: (val) => Object.is(val, value) }, typeProto);
	    },
	    notAllow(value) {
	        return addTypeValidators(this, true, { validator: (val) => !Object.is(val, value) }, typeProto);
	    },
	    oneOf(values) {
	        return addTypeValidators(this, false, { validator: (val) => values.includes(val) }, typeProto);
	    },
	    notOneOf(values) {
	        return addTypeValidators(this, true, { validator: (val) => !values.includes(val) }, typeProto);
	    }
	};

	function cb(item, index) {
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
	        return addTypeValidators(this, true, {
	            validator: (arr) => arr.every(cb, validator)
	        });
	    },
	    get nonEmpty() {
	        return addTypeValidators(this, true, { validator: isNonZeroLength });
	    }
	};

	const dateTypeProto = {
	    __proto__: typeProto,
	    earlier(earlierThanDate) {
	        return addTypeValidators(this, true, {
	            validator: (date) => date < new Date(earlierThanDate)
	        });
	    },
	    later(laterThanDate) {
	        return addTypeValidators(this, true, {
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
	        return addTypeValidators(this, true, {
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
	        return addTypeValidators(this, true, {
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
	        return addTypeValidators(this, true, { validator: isNonZeroSize });
	    }
	};

	const isInteger = (num) => Number.isInteger(num);
	const numberTypeProto = {
	    __proto__: typeProto,
	    lt(value) {
	        return addTypeValidators(this, true, { validator: (num) => num < value });
	    },
	    less(value) {
	        return this.lt(value);
	    },
	    lte(value) {
	        return addTypeValidators(this, true, { validator: (num) => num <= value });
	    },
	    max(value) {
	        return this.lte(value);
	    },
	    gt(value) {
	        return addTypeValidators(this, true, { validator: (num) => num > value });
	    },
	    greater(value) {
	        return this.gt(value);
	    },
	    gte(value) {
	        return addTypeValidators(this, true, { validator: (num) => num >= value });
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
	        return addTypeValidators(this, true, { validator: isInteger });
	    }
	};

	const hasOwn$1 = Object.prototype.hasOwnProperty;
	function cb1$1(entry) {
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
	function cb2$1(entry) {
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
	function cb3(key) {
	    return this.test(key);
	}
	const objectTypeProto = {
	    __proto__: typeProto,
	    shape(shape, exact) {
	        let validators = [];
	        if (exact) {
	            let shapeKeys = Object.keys(shape);
	            let hasKey = (key) => shapeKeys.includes(key);
	            validators.push({ validator: (obj) => Object.keys(obj).every(hasKey) });
	        }
	        let shapeEntries = Object.entries(shape);
	        validators.push({ validator: (obj) => shapeEntries.every(cb1$1, obj) });
	        return addTypeValidators(this, true, validators);
	    },
	    exactShape(shape) {
	        return this.shape(shape, true);
	    },
	    keys(re) {
	        return addTypeValidators(this, true, {
	            validator: (obj) => Object.keys(obj).every(cb3, re)
	        });
	    },
	    values(validator) {
	        return addTypeValidators(this, true, {
	            validator: (obj) => Object.entries(obj).every(cb2$1, validator)
	        });
	    },
	    get nonEmpty() {
	        return addTypeValidators(this, true, {
	            validator: (obj) => {
	                for (let key in obj) {
	                    if (hasOwn$1.call(obj, key)) {
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
	        return addTypeValidators(this, true, {
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
	        return addTypeValidators(this, true, { validator: isNonZeroSize });
	    }
	};

	const isNonEmpty = (str) => /\S/.test(str);
	const stringTypeProto = {
	    __proto__: typeProto,
	    len(value) {
	        return addTypeValidators(this, true, { validator: (str) => str.length == value });
	    },
	    minLen(value) {
	        return addTypeValidators(this, true, {
	            validator: (str) => str.length >= value
	        });
	    },
	    maxLen(value) {
	        return addTypeValidators(this, true, {
	            validator: (str) => str.length <= value
	        });
	    },
	    pattern(re) {
	        return addTypeValidators(this, true, { validator: (str) => re.test(str) });
	    },
	    matches(re) {
	        return this.pattern(re);
	    },
	    startsWith(searchString, position) {
	        return addTypeValidators(this, true, {
	            validator: (str) => str.startsWith(searchString, position)
	        });
	    },
	    endsWith(searchString, position) {
	        return addTypeValidators(this, true, {
	            validator: (str) => str.endsWith(searchString, position)
	        });
	    },
	    get nonZero() {
	        return addTypeValidators(this, true, { validator: isNonZeroLength });
	    },
	    get nonEmpty() {
	        return addTypeValidators(this, true, { validator: isNonEmpty });
	    }
	};

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
	const typesProto = {
	    [KEY_STATE]: null,
	    get not() {
	        let types = {
	            __proto__: typesProto,
	            [KEY_STATE]: Object.assign(Object.assign({}, this[KEY_STATE]), { notMode: true })
	        };
	        return types;
	    },
	    custom(validator, _typeProto = typeProto) {
	        return addTypeValidators(this, this[KEY_STATE].andMode, typeof validator == 'function' ? { validator } : validator, _typeProto);
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
	    if (arguments.length == 1) {
	        return (value) => {
	            return om(validator, value);
	        };
	    }
	    validationState.errorMessage = null;
	    validationState.errorTypes.length = 0;
	    validationState.errorKeypatch = null;
	    if (!validator(value)) {
	        throw TypeError((validationState.errorMessage ||
	            (validationState.errorTypes.length
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

	Object.defineProperty(exports, '__esModule', { value: true });

})));
