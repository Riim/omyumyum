import { KEY_STATE } from './constants';
import { I$Validator, IType } from './types/Type';
import { validationState } from './validationState';

const hasOwn = Object.prototype.hasOwnProperty;

export const check = (type: IType, value: any): boolean =>
	type[KEY_STATE].validators.some(cb1, value);

function cb1(this: any, validators: Array<I$Validator>): boolean {
	return validators.every(cb2, this);
}

function cb2(this: any, validator: I$Validator): boolean {
	let result = validator.validator(this);

	if (result === true) {
		validationState.errorTypes.length = 0;
		return true;
	}

	if (typeof result == 'string') {
		validationState.errorMessage = result;
		return false;
	}

	if (result) {
		validationState.errorTypes.length = 0;
	} else if (!validationState.errorMessage) {
		if (hasOwn.call(validator, 'message')) {
			validationState.errorMessage = validator.message!;
		}
		if (hasOwn.call(validator, 'type')) {
			validationState.errorTypes.push(validator.type!);
		}
	}

	return result;
}
