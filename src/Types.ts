import { addValidator } from './addValidator';
import { KEY_STATE } from './constants';
import { I$Validator, IState } from './State';
import { arrayTypeProto, IArrayType } from './types/ArrayType';
import { dateTypeProto, IDateType } from './types/DateType';
import { IMapType, mapTypeProto } from './types/MapType';
import { INumberType, numberTypeProto } from './types/NumberType';
import { IObjectType, objectTypeProto } from './types/ObjectType';
import { ISetType, setTypeProto } from './types/SetType';
import { IStringType, stringTypeProto } from './types/StringType';
import { IType, typeProto } from './types/Type';

const isNull = (value: any): boolean => value === null;
const isUndefined = (value: any): boolean => value === undefined;
const isVacuum = (value: any): boolean => value == null;
const isBoolean = (value: any): boolean => typeof value == 'boolean';
const isNumber = (value: any): boolean => typeof value == 'number' && Number.isFinite(value);
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
	custom<T extends IType>(
		validator: ((value: any) => boolean | string) | I$Validator,
		_typeProto?: object
	): T;
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

export const typesProto: ITypes = {
	[KEY_STATE]: null as any,

	get not() {
		return {
			__proto__: typesProto,
			[KEY_STATE]: { ...(this as ITypes)[KEY_STATE], notMode: true }
		} as any;
	},

	custom<T extends IType>(
		this: ITypes,
		validator: I$Validator | ((value: any) => boolean | string),
		_typeProto = typeProto
	) {
		return addValidator<T>(
			this,
			this[KEY_STATE].andMode,
			typeof validator == 'function' ? ({ validator } as I$Validator) : validator,
			_typeProto
		);
	},

	get null() {
		return (this as ITypes).custom({ validator: isNull, type: 'null' });
	},
	get undefined() {
		return (this as ITypes).custom({ validator: isUndefined, type: 'undefined' });
	},
	get vacuum() {
		return (this as ITypes).custom({ validator: isVacuum, type: 'vacuum' });
	},
	get boolean() {
		return (this as ITypes).custom({ validator: isBoolean, type: 'boolean' });
	},
	get number() {
		return (this as ITypes).custom<INumberType>(
			{ validator: isNumber, type: 'number' },
			numberTypeProto
		);
	},
	get string() {
		return (this as ITypes).custom<IStringType>(
			{ validator: isString, type: 'string' },
			stringTypeProto
		);
	},
	get symbol() {
		return (this as ITypes).custom({ validator: isSymbol, type: 'symbol' });
	},
	get object() {
		return (this as ITypes).custom<IObjectType>(
			{ validator: isObject, type: 'Object' },
			objectTypeProto
		);
	},
	get array() {
		return (this as ITypes).custom<IArrayType>(
			{ validator: isArray, type: 'Array' },
			arrayTypeProto
		);
	},
	get function() {
		return (this as ITypes).custom({ validator: isFunction, type: 'Function' });
	},
	get func() {
		return (this as ITypes).function;
	},
	get map() {
		return (this as ITypes).custom<IMapType>({ validator: isMap, type: 'Map' }, mapTypeProto);
	},
	get set() {
		return (this as ITypes).custom<ISetType>({ validator: isSet, type: 'Set' }, setTypeProto);
	},
	get weakMap() {
		return (this as ITypes).custom<IMapType>(
			{ validator: isWeakMap, type: 'WeakMap' },
			mapTypeProto
		);
	},
	get wmap() {
		return (this as ITypes).weakMap;
	},
	get weakSet() {
		return (this as ITypes).custom<ISetType>(
			{ validator: isWeakSet, type: 'WeakSet' },
			setTypeProto
		);
	},
	get wset() {
		return (this as ITypes).weakSet;
	},
	get date() {
		return (this as ITypes).custom<IDateType>(
			{ validator: isDate, type: 'Date' },
			dateTypeProto
		);
	},
	get regExp() {
		return (this as ITypes).custom({ validator: isRegExp, type: 'RegExp' });
	},
	get regex() {
		return (this as ITypes).regExp;
	},
	get promise() {
		return (this as ITypes).custom({ validator: isPromise, type: 'Promise' });
	},
	get error() {
		return (this as ITypes).custom({ validator: isError, type: 'Error' });
	}
};
