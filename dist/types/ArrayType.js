import { addValidator } from '../addValidator';
import { isNonZeroLength } from '../lib/utils';
import { validationState } from '../validationState';
import { typeProto } from './Type';
function arrayOfCallback(item, index) {
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
        return addValidator(this, true, {
            validator: (arr) => arr.every(arrayOfCallback, validator)
        });
    },
    len(value) {
        return addValidator(this, true, {
            validator: (arr) => arr.length == value
        });
    },
    minLen(value) {
        return addValidator(this, true, {
            validator: (arr) => arr.length >= value
        });
    },
    maxLen(value) {
        return addValidator(this, true, {
            validator: (arr) => arr.length <= value
        });
    },
    get nonEmpty() {
        return addValidator(this, true, { validator: isNonZeroLength });
    }
};
