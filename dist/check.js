import { findLast } from './lib/utils';
import { validationState } from './validationState';
export const check = (state, value) => state.validators.some((validators) => checkCallback(state, validators, value));
export const checkCallback = (state, validators, value) => validators.every((validator) => checkCallbackCallback(state, validator, value));
export const checkCallbackCallback = (state, validator, value) => {
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
        let errorTypes = state.validators.map((validators) => { var _a; return (_a = findLast(validators, (validator) => validator.type)) === null || _a === void 0 ? void 0 : _a.type; });
        if (errorTypes.every(Boolean)) {
            validationState.errorTypes = errorTypes;
        }
    }
    return result;
};
