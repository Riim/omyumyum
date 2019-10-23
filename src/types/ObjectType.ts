import { validationState } from '../validationState';
import { addTypeValidators } from './addTypeValidators';
import { IType, TValidator, typeProto } from './Type';

export interface IObjectType extends IType {
	shape(shape: Record<string, TValidator>, exact?: boolean): IObjectType;
	exactShape(shape: Record<string, TValidator>): IObjectType;
	values(validator: TValidator): IObjectType;
}

function cb1(this: Record<string, any>, entry: [string, TValidator]): boolean {
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

function cb2(this: TValidator, entry: any): boolean {
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

export const objectTypeProto: Object = {
	__proto__: typeProto,

	shape(shape: Record<string, TValidator>, exact?: boolean): IObjectType {
		let validators: Array<TValidator> = [];

		if (exact) {
			let shapeKeys = Object.keys(shape);
			let hasKey = (key: string) => shapeKeys.includes(key);
			validators.push((obj: object) => Object.keys(obj).every(hasKey));
		}

		let shapeEntries = Object.entries(shape);
		validators.push((obj: object) => shapeEntries.every(cb1, obj));

		return addTypeValidators(this, objectTypeProto, true, validators);
	},

	exactShape(shape: Record<string, TValidator>): IObjectType {
		return this.shape(shape, true) as IObjectType;
	},

	values(validator: TValidator): IObjectType {
		return addTypeValidators(this, objectTypeProto, true, (obj: object) =>
			Object.entries(obj).every(cb2, validator)
		);
	}
};
