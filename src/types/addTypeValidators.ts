import { check } from '../check';
import { KEY_STATE } from '../constants';
import { ITypes } from '../Types';
import { IType, TValidator } from './Type';

export function addTypeValidators<T extends IType>(
	type: IType | ITypes,
	typeProto: object,
	andMode: boolean,
	validator: TValidator | Array<TValidator>
): T {
	if (type[KEY_STATE].notMode) {
		validator =
			typeof validator == 'function'
				? (validator => (value: any) => !validator(value))(validator)
				: validator.map(validator => (value: any) => !validator(value));
	}

	let newType: T = ((value: any): boolean => check(newType, value)) as any;
	(newType as any).__proto__ = typeProto;

	let validators = type[KEY_STATE].validators.slice();

	if (andMode) {
		let validators_ = (validators[validators.length - 1] = validators[
			validators.length - 1
		].slice());

		if (typeof validator == 'function') {
			validators_.push(validator);
		} else {
			validators_.push(...validator);
		}
	} else {
		validators.push(typeof validator == 'function' ? [validator] : validator);
	}

	newType[KEY_STATE] = {
		validators,
		notMode: false,
		andMode: false
	};

	return newType;
}
