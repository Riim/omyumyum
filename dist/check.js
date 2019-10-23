import { KEY_STATE } from './constants';
export const check = (type, value) => type[KEY_STATE].validators.some(cb1, value);
function cb1(validators) {
    return validators.length == 1 ? validators[0](this) : validators.every(cb2, this);
}
function cb2(validator) {
    return validator(this);
}
