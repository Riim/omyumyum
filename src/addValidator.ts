import { check } from './check';
import { KEY_STATE } from './constants';
import { I$Validator } from './State';
import { ITypes } from './Types';
import { IType } from './types/Type';

export function addValidator<T extends IType>(
	type: IType | ITypes,
	andMode: boolean,
	validator: I$Validator | Array<I$Validator>,
	typeProto: object = (type as any).__proto__
): T {
	if (type[KEY_STATE].notMode) {
		validator = {
			validator: (
				(validator) => (value: any) =>
					!validator(value)
			)((validator as I$Validator).validator),
			message: (validator as I$Validator).message,
			type: (validator as I$Validator).type
		};
	}

	let newType: T = ((value: any): boolean => check(newType[KEY_STATE], value)) as any;
	(newType as any).__proto__ = typeProto;

	let validators = type[KEY_STATE].validators.slice();

	if (andMode) {
		let validators_ = (validators[validators.length - 1] =
			validators[validators.length - 1].slice());

		if (Array.isArray(validator)) {
			validators_.push(...validator);
		} else {
			validators_.push(validator);
		}
	} else {
		validators.push(Array.isArray(validator) ? validator : [validator]);
	}

	newType[KEY_STATE] = {
		validators,
		notMode: false,
		andMode: false
	};

	return newType;
}
