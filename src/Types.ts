import { KEY_STATE } from './constants';
import { addTypeValidators } from './types/addTypeValidators';
import { arrayTypeProto, IArrayType } from './types/ArrayType';
import { dateTypeProto, IDateType } from './types/DateType';
import { IMapType, mapTypeProto } from './types/MapType';
import { INumberType, numberTypeProto } from './types/NumberType';
import { IObjectType, objectTypeProto } from './types/ObjectType';
import { ISetType, setTypeProto } from './types/SetType';
import { IStringType, stringTypeProto } from './types/StringType';
import { IState, IType, typeProto } from './types/Type';

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
	custom(validator: (value: any) => boolean): IType;
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

	custom(this: ITypes, validator: (value: any) => boolean, _typeProto = typeProto): IType {
		return addTypeValidators(this, _typeProto, this[KEY_STATE].andMode, validator);
	},

	get null(this: ITypes): IType {
		return this.custom(isNull);
	},
	get undefined(this: ITypes): IType {
		return this.custom(isUndefined);
	},
	get vacuum(this: ITypes): IType {
		return this.custom(isVacuum);
	},
	get boolean(this: ITypes): IType {
		return this.custom(isBoolean);
	},
	get number(this: ITypes): INumberType {
		return (this as any).custom(isNumber, numberTypeProto);
	},
	get string(this: ITypes): IStringType {
		return (this as any).custom(isString, stringTypeProto);
	},
	get symbol(this: ITypes): IType {
		return this.custom(isSymbol);
	},
	get object(this: ITypes): IObjectType {
		return (this as any).custom(isObject, objectTypeProto);
	},
	get array(this: ITypes): IArrayType {
		return (this as any).custom(isArray, arrayTypeProto);
	},
	get function(this: ITypes): IType {
		return this.custom(isFunction);
	},
	get func(this: ITypes): IType {
		return this.function;
	},
	get map(this: ITypes): IMapType {
		return (this as any).custom(isMap, mapTypeProto);
	},
	get set(this: ITypes): ISetType {
		return (this as any).custom(isSet, setTypeProto);
	},
	get weakMap(this: ITypes): IType {
		return (this as any).custom(isWeakMap, mapTypeProto);
	},
	get wmap(this: ITypes): IType {
		return this.weakMap;
	},
	get weakSet(this: ITypes): IType {
		return (this as any).custom(isWeakSet, setTypeProto);
	},
	get wset(this: ITypes): IType {
		return this.weakSet;
	},
	get date(this: ITypes): IDateType {
		return (this as any).custom(isDate, dateTypeProto);
	},
	get regExp(this: ITypes): IType {
		return this.custom(isRegExp);
	},
	get regex(this: ITypes): IType {
		return this.regExp;
	},
	get promise(this: ITypes): IType {
		return this.custom(isPromise);
	},
	get error(this: ITypes): IType {
		return this.custom(isError);
	}
};
