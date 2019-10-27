import { addTypeValidators } from '../addTypeValidators';
import { validationState } from '../validationState';
import { typeProto } from './Type';
const hasOwn = Object.prototype.hasOwnProperty;
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
function cb3(key) {
    return this.test(key);
}
export const objectTypeProto = {
    __proto__: typeProto,
    shape(shape, exact) {
        let validators = [];
        if (exact) {
            let shapeKeys = Object.keys(shape);
            let hasKey = (key) => shapeKeys.includes(key);
            validators.push({ validator: (obj) => Object.keys(obj).every(hasKey) });
        }
        let shapeEntries = Object.entries(shape);
        validators.push({ validator: (obj) => shapeEntries.every(cb1, obj) });
        return addTypeValidators(this, true, validators);
    },
    exactShape(shape) {
        return this.shape(shape, true);
    },
    keys(re) {
        return addTypeValidators(this, true, {
            validator: (obj) => Object.keys(obj).every(cb3, re)
        });
    },
    values(validator) {
        return addTypeValidators(this, true, {
            validator: (obj) => Object.entries(obj).every(cb2, validator)
        });
    },
    get nonEmpty() {
        return addTypeValidators(this, true, {
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
