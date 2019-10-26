import { KEY_STATE } from './constants';
import { validationState } from './validationState';
const hasOwn = Object.prototype.hasOwnProperty;
export const check = (type, value) => type[KEY_STATE].validators.some(cb1, value);
function cb1(validators) {
    return validators.every(cb2, this);
}
function cb2(validator) {
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
    }
    else if (!validationState.errorMessage) {
        if (validator.message && hasOwn.call(validator, 'message')) {
            validationState.errorMessage = validator.message;
        }
        if (validator.type && hasOwn.call(validator, 'type')) {
            validationState.errorTypes.push(validator.type);
        }
    }
    return result;
}
