import { check } from './check';
import { KEY_STATE } from './constants';
import { ITypes } from './Types';
import { I$Validator, IType } from './types/Type';

export function addTypeValidators<T extends IType>(
	type: IType | ITypes,
	andMode: boolean,
	validator: I$Validator | Array<I$Validator>,
	typeProto?: object
): T {
	if (type[KEY_STATE].notMode) {
		validator = {
			validator: (validator => (value: any) => !validator(value))(
				(validator as I$Validator).validator
			),
			message: (validator as I$Validator).message,
			type: (validator as I$Validator).type
		};
	}

	let newType: T = ((value: any): boolean => check(newType, value)) as any;
	(newType as any).__proto__ = typeProto || (type as any).__proto__;

	let validators = type[KEY_STATE].validators.slice();

	if (andMode) {
		let validators_ = (validators[validators.length - 1] = validators[
			validators.length - 1
		].slice());

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
