import { addTypeValidators } from './addTypeValidators';
import { KEY_STATE } from './constants';
import { arrayTypeProto, IArrayType } from './types/ArrayType';
import { dateTypeProto, IDateType } from './types/DateType';
import { IMapType, mapTypeProto } from './types/MapType';
import { INumberType, numberTypeProto } from './types/NumberType';
import { IObjectType, objectTypeProto } from './types/ObjectType';
import { ISetType, setTypeProto } from './types/SetType';
import { IStringType, stringTypeProto } from './types/StringType';
import {
	I$Validator,
	IState,
	IType,
	typeProto
	} from './types/Type';

const isNull = (value: any): boolean => value === null;
const isUndefined = (value: any): boolean => value === undefined;
const isVacuum = (value: any): boolean => value == null;
const isBoolean = (value: any): boolean => typeof value == 'boolean';
const isNumber = (value: any): boolean =>
	typeof value == 'number' && Number.isFinite(value) && !Number.isNaN(value);
const isString = (value: any): boolean => typeof value == 'string';
const isSymbol = (value: any): boolean => typeof value == 'symbol';
const isObject = (value: any): boolean => value === Object(value);
const isArray = Array.isArray;
const isFunction = (value: any): boolean => typeof value == 'function';
const isSet = (value: any): boolean => value instanceof Set;
const isMap = (value: any): boolean => value instanceof Map;
const isWeakSet = (value: any): boolean => value instanceof WeakSet;
const isWeakMap = (value: any): boolean => value instanceof WeakMap;
const isDate = (value: any): boolean => value instanceof Date;
const isRegExp = (value: any): boolean => value instanceof RegExp;
const isPromise = (value: any): boolean => value instanceof Promise;
const isError = (value: any): boolean => value instanceof Error;

export interface ITypes {
	[KEY_STATE]: IState;
	not: ITypes;
	custom(validator: ((value: any) => boolean | string) | I$Validator): IType;
	null: IType;
	undefined: IType;
	vacuum: IType;
	boolean: IType;
	number: INumberType;
	string: IStringType;
	symbol: IType;
	object: IObjectType;
	array: IArrayType;
	function: IType;
	func: IType;
	map: IMapType;
	set: ISetType;
	weakMap: IMapType;
	wmap: IMapType;
	weakSet: ISetType;
	wset: ISetType;
	date: IDateType;
	regExp: IType;
	regex: IType;
	promise: IType;
	error: IType;
}

export const typesProto: Object = {
	[KEY_STATE]: null,

	get not(this: ITypes): ITypes {
		let types: ITypes = {
			__proto__: typesProto,
			[KEY_STATE]: { ...this[KEY_STATE], notMode: true }
		} as any;

		return types;
	},

	custom(
		this: ITypes,
		validator: ((value: any) => boolean | string) | I$Validator,
		_typeProto = typeProto
	): IType {
		return addTypeValidators(
			this,
			this[KEY_STATE].andMode,
			typeof validator == 'function' ? ({ validator } as I$Validator) : validator,
			_typeProto
		);
	},

	get null(this: ITypes): IType {
		return this.custom({ validator: isNull, type: 'null' });
	},
	get undefined(this: ITypes): IType {
		return this.custom({ validator: isUndefined, type: 'undefined' });
	},
	get vacuum(this: ITypes): IType {
		return this.custom({ validator: isVacuum, type: 'vacuum' });
	},
	get boolean(this: ITypes): IType {
		return this.custom({ validator: isBoolean, type: 'boolean' });
	},
	get number(this: ITypes): INumberType {
		return (this as any).custom({ validator: isNumber, type: 'number' }, numberTypeProto);
	},
	get string(this: ITypes): IStringType {
		return (this as any).custom({ validator: isString, type: 'string' }, stringTypeProto);
	},
	get symbol(this: ITypes): IType {
		return this.custom({ validator: isSymbol, type: 'symbol' });
	},
	get object(this: ITypes): IObjectType {
		return (this as any).custom({ validator: isObject, type: 'Object' }, objectTypeProto);
	},
	get array(this: ITypes): IArrayType {
		return (this as any).custom({ validator: isArray, type: 'Array' }, arrayTypeProto);
	},
	get function(this: ITypes): IType {
		return this.custom({ validator: isFunction, type: 'Function' });
	},
	get func(this: ITypes): IType {
		return this.function;
	},
	get map(this: ITypes): IMapType {
		return (this as any).custom({ validator: isMap, type: 'Map' }, mapTypeProto);
	},
	get set(this: ITypes): ISetType {
		return (this as any).custom({ validator: isSet, type: 'Set' }, setTypeProto);
	},
	get weakMap(this: ITypes): IType {
		return (this as any).custom({ validator: isWeakMap, type: 'WeakMap' }, mapTypeProto);
	},
	get wmap(this: ITypes): IType {
		return this.weakMap;
	},
	get weakSet(this: ITypes): IType {
		return (this as any).custom({ validator: isWeakSet, type: 'WeakSet' }, setTypeProto);
	},
	get wset(this: ITypes): IType {
		return this.weakSet;
	},
	get date(this: ITypes): IDateType {
		return (this as any).custom({ validator: isDate, type: 'Date' }, dateTypeProto);
	},
	get regExp(this: ITypes): IType {
		return this.custom({ validator: isRegExp, type: 'RegExp' });
	},
	get regex(this: ITypes): IType {
		return this.regExp;
	},
	get promise(this: ITypes): IType {
		return this.custom({ validator: isPromise, type: 'Promise' });
	},
	get error(this: ITypes): IType {
		return this.custom({ validator: isError, type: 'Error' });
	}
};
