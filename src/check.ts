import { findLast } from './lib/utils';
import { I$Validator, IState } from './State';
import { validationState } from './validationState';

export const check = (state: IState, value: any): boolean =>
	state.validators.some((validators: Array<I$Validator>) =>
		checkCallback(state, validators, value)
	);

export const checkCallback = (state: IState, validators: Array<I$Validator>, value: any): boolean =>
	validators.every((validator: I$Validator) => checkCallbackCallback(state, validator, value));

export const checkCallbackCallback = (
	state: IState,
	validator: I$Validator,
	value: any
): boolean => {
	let result = validator.validator(value);

	if (validationState.errorMessage || validationState.errorTypes) {
		return result;
	}

	if (typeof result == 'string') {
		validationState.errorMessage = result;
		return false;
	}

	if (!result) {
		if (validator.message) {
			validationState.errorMessage = validator.message;
		}

		let errorTypes = state.validators.map(
			(validators) => findLast(validators, (validator) => validator.type)?.type
		);

		if (errorTypes.every(Boolean)) {
			validationState.errorTypes = errorTypes as Array<string>;
		}
	}

	return result;
};
