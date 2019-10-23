import { check } from '../check';
import { KEY_STATE } from '../constants';
import { ITypes } from '../Types';
import { IType, TValidator } from './Type';

export function addTypeValidators<T extends IType>(
	type: IType | ITypes,
	newTypeProto: object,
	andMode: boolean,
	validators: Array<TValidator>
): T {
	let newType: T = ((value: any): boolean => check(newType, value)) as any;
	(newType as any).__proto__ = newTypeProto;

	let validators_ = type[KEY_STATE].validators.slice();

	if (andMode) {
		validators_[validators_.length - 1] = [
			...validators_[validators_.length - 1],
			...validators
		];
	} else {
		validators_.push(validators);
	}

	newType[KEY_STATE] = { validators: validators_, andMode: false };

	return newType;
}
