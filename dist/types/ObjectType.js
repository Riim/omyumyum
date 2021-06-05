import { addValidator } from '../addValidator';
import { validationState } from '../validationState';
import { typeProto } from './Type';
const hasOwn = Object.prototype.hasOwnProperty;
function objectShapeCallback(entry) {
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
function objectKeysCallback(key) {
    return this.test(key);
}
function objectValuesCallback(entry) {
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
            validators.push({
                validator: (obj) => Object.keys(obj).every(hasKey),
                message: 'Invalid object shape'
            });
        }
        let shapeEntries = Object.entries(shape);
        validators.push({
            validator: (obj) => shapeEntries.every(objectShapeCallback, obj)
        });
        return addValidator(this, true, validators);
    },
    exactShape(shape) {
        return this.shape(shape, true);
    },
    keys(re) {
        return addValidator(this, true, {
            validator: (obj) => Object.keys(obj).every(objectKeysCallback, re)
        });
    },
    values(validator) {
        return addValidator(this, true, {
            validator: (obj) => Object.entries(obj).every(objectValuesCallback, validator)
        });
    },
    get nonEmpty() {
        return addValidator(this, true, {
            validator: (obj) => {
                for (let key in obj) {
                    if (hasOwn.call(obj, key)) {
                        return true;
                    }
                }
                return false;
            }
        });
    }
};
