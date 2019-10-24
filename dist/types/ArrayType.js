import { validationState } from '../validationState';
import { addTypeValidators } from './addTypeValidators';
import { typeProto } from './Type';
function cb(item, index) {
    let prevKeypath = validationState.currentKeypath;
    validationState.currentKeypath = validationState.currentKeypath + `[${index}]`;
    let result = this(item);
    if (!result && !validationState.errorKeypatch) {
        validationState.errorKeypatch = validationState.currentKeypath;
    }
    validationState.currentKeypath = prevKeypath;
    return result;
}
export const arrayTypeProto = {
    __proto__: typeProto,
    of(validator) {
        return addTypeValidators(this, true, (arr) => arr.every(cb, validator));
    },
    get nonEmpty() {
        return addTypeValidators(this, true, (arr) => arr.length > 0);
    }
};
