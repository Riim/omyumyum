import { addValidator } from '../addValidator';
import { I$Validator, TValidator } from '../State';
import { validationState } from '../validationState';
import { ITypeProto, typeProto } from './Type';

const hasOwn = Object.prototype.hasOwnProperty;

export interface IObjectType extends IObjectTypeProto {
	(value: any): boolean;
}

export interface IObjectTypeProto extends ITypeProto {
	shape(shape: Record<string, TValidator>, exact?: boolean): IObjectType;
	exactShape(shape: Record<string, TValidator>): IObjectType;
	keys(re: RegExp): IObjectType;
	values(validator: TValidator): IObjectType;
	nonEmpty: IObjectType;
}

function objectShapeCallback(this: Record<string, any>, entry: [string, TValidator]): boolean {
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

function objectKeysCallback(this: RegExp, key: string) {
	return this.test(key);
}

function objectValuesCallback(this: TValidator, entry: any): boolean {
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

export const objectTypeProto = {
	__proto__: typeProto as any,

	shape(shape, exact) {
		let validators: Array<I$Validator> = [];

		if (exact) {
			let shapeKeys = Object.keys(shape);
			let hasKey = (key: string) => shapeKeys.includes(key);

			validators.push({
				validator: (obj: object) => Object.keys(obj).every(hasKey),
				message: 'Invalid object shape'
			});
		}

		let shapeEntries = Object.entries(shape);
		validators.push({
			validator: (obj: object) => shapeEntries.every(objectShapeCallback, obj)
		});

		return addValidator(this, true, validators);
	},

	exactShape(shape) {
		return this.shape(shape, true) as IObjectType;
	},

	keys(re) {
		return addValidator(this, true, {
			validator: (obj: object) => Object.keys(obj).every(objectKeysCallback, re)
		});
	},

	values(validator) {
		return addValidator(this, true, {
			validator: (obj: object) => Object.entries(obj).every(objectValuesCallback, validator)
		});
	},

	get nonEmpty() {
		return addValidator(this, true, {
			validator: (obj: object) => {
				for (let key in obj) {
					if (hasOwn.call(obj, key)) {
						return true;
					}
				}

				return false;
			}
		});
	}
} as IObjectTypeProto;
