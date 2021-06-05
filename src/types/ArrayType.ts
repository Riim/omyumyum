import { addValidator } from '../addValidator';
import { isNonZeroLength } from '../lib/utils';
import { TValidator } from '../State';
import { validationState } from '../validationState';
import { ITypeProto, typeProto } from './Type';

export interface IArrayType extends IArrayTypeProto {
	(value: any): boolean;
}

export interface IArrayTypeProto extends ITypeProto {
	of(validator: TValidator): IArrayType;
	len(value: number): IArrayType;
	minLen(value: number): IArrayType;
	maxLen(value: number): IArrayType;
	nonEmpty: IArrayType;
}

function arrayOfCallback(this: TValidator, item: any, index: number): boolean {
	let prevKeypath = validationState.currentKeypath;
	validationState.currentKeypath = validationState.currentKeypath + `[${index}]`;

	let result = this(item);

	if (!result && !validationState.errorKeypatch) {
		validationState.errorKeypatch = validationState.currentKeypath;
	}

	validationState.currentKeypath = prevKeypath;

	return result;
}

export const arrayTypeProto = {
	__proto__: typeProto as any,

	of(validator) {
		return addValidator(this, true, {
			validator: (arr: Array<any>) => arr.every(arrayOfCallback, validator)
		});
	},

	len(value) {
		return addValidator(this, true, {
			validator: (arr: Array<any>) => arr.length == value
		});
	},

	minLen(value) {
		return addValidator(this, true, {
			validator: (arr: Array<any>) => arr.length >= value
		});
	},

	maxLen(value) {
		return addValidator(this, true, {
			validator: (arr: Array<any>) => arr.length <= value
		});
	},

	get nonEmpty() {
		return addValidator(this, true, { validator: isNonZeroLength });
	}
} as IArrayTypeProto;
