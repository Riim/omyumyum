import { validationState } from '../validationState';
import { addTypeValidators } from './addTypeValidators';
import { typeProto } from './Type';
function cb1(entry) {
    let [key, validator] = entry;
    let prevKeypath = validationState.currentKeypath;
    validationState.currentKeypath =
        validationState.currentKeypath + (validationState.currentKeypath ? '.' : '') + key;
    let result = validator(this[key]);
    if (!result && !validationState.errorKeypatch) {
        validationState.errorKeypatch = validationState.currentKeypath;
    }
    validationState.currentKeypath = prevKeypath;
    return result;
}
function cb2(entry) {
    let [key, value] = entry;
    let prevKeypath = validationState.currentKeypath;
    validationState.currentKeypath =
        validationState.currentKeypath + (validationState.currentKeypath ? '.' : '') + key;
    let result = this(value);
    if (!result && !validationState.errorKeypatch) {
        validationState.errorKeypatch = validationState.currentKeypath;
    }
    validationState.currentKeypath = prevKeypath;
    return result;
}
export const objectTypeProto = {
    __proto__: typeProto,
    shape(shape, exact) {
        let validators = [];
        if (exact) {
            let shapeKeys = Object.keys(shape);
            let hasKey = (key) => shapeKeys.includes(key);
            validators.push((obj) => Object.keys(obj).every(hasKey));
        }
        let shapeEntries = Object.entries(shape);
        validators.push((obj) => shapeEntries.every(cb1, obj));
        return addTypeValidators(this, objectTypeProto, true, validators);
    },
    exactShape(shape) {
        return this.shape(shape, true);
    },
    values(validator) {
        return addTypeValidators(this, objectTypeProto, true, (obj) => Object.entries(obj).every(cb2, validator));
    }
};
