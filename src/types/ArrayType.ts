import { validationState } from '../validationState';
import { addTypeValidators } from './addTypeValidators';
import { IType, TValidator, typeProto } from './Type';

export interface IArrayType extends IType {
	of(validator: TValidator): IArrayType;
}

function cb(this: TValidator, item: any, index: number): boolean {
	let prevKeypath = validationState.currentKeypath;
	validationState.currentKeypath = validationState.currentKeypath + `[${index}]`;

	let result = this(item);

	if (!result && !validationState.errorKeypatch) {
		validationState.errorKeypatch = validationState.currentKeypath;
	}

	validationState.currentKeypath = prevKeypath;

	return result;
}

export const arrayTypeProto: Object = {
	__proto__: typeProto,

	of(validator: TValidator): IArrayType {
		return addTypeValidators(this, true, (arr: Array<any>) => arr.every(cb, validator));
	}
};
