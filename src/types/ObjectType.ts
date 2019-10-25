import { addTypeValidators } from '../addTypeValidators';
import { validationState } from '../validationState';
import {
	I$Validator,
	IType,
	TSimpleValidator,
	typeProto
	} from './Type';

const hasOwn = Object.prototype.hasOwnProperty;

export interface IObjectType extends IType {
	shape(shape: Record<string, TSimpleValidator>, exact?: boolean): IObjectType;
	exactShape(shape: Record<string, TSimpleValidator>): IObjectType;
	values(validator: TSimpleValidator): IObjectType;
	nonEmpty: IObjectType;
}

function cb1(this: Record<string, any>, entry: [string, TSimpleValidator]): boolean {
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

function cb2(this: TSimpleValidator, entry: any): boolean {
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

	shape(shape: Record<string, TSimpleValidator>, exact?: boolean): IObjectType {
		let validators: Array<I$Validator> = [];

		if (exact) {
			let shapeKeys = Object.keys(shape);
			let hasKey = (key: string) => shapeKeys.includes(key);
			validators.push({ validator: (obj: object) => Object.keys(obj).every(hasKey) });
		}

		let shapeEntries = Object.entries(shape);
		validators.push({ validator: (obj: object) => shapeEntries.every(cb1, obj) });

		return addTypeValidators(this, true, validators);
	},

	exactShape(shape: Record<string, TSimpleValidator>): IObjectType {
		return this.shape(shape, true) as IObjectType;
	},

	values(validator: TSimpleValidator): IObjectType {
		return addTypeValidators(this, true, {
			validator: (obj: object) => Object.entries(obj).every(cb2, validator)
		});
	},

	get nonEmpty(): IObjectType {
		return addTypeValidators(this, true, {
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
};
