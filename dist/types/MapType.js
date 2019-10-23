import { validationState } from '../validationState';
import { addTypeValidators } from './addTypeValidators';
import { typeProto } from './Type';
export const mapTypeProto = {
    __proto__: typeProto,
    of(validator) {
        return addTypeValidators(this, mapTypeProto, true, [
            (map) => {
                for (let entry of map) {
                    let prevKeypath = validationState.currentKeypath;
                    validationState.currentKeypath =
                        validationState.currentKeypath + `[${entry[0]}]`;
                    if (!validator(entry)) {
                        if (!validationState.errorKeypatch) {
                            validationState.errorKeypatch = validationState.currentKeypath;
                        }
                        validationState.currentKeypath = prevKeypath;
                        return false;
                    }
                    validationState.currentKeypath = prevKeypath;
                }
                return true;
            }
        ]);
    },
    values(validator) {
        return addTypeValidators(this, mapTypeProto, true, [
            (map) => {
                for (let [key, value] of map) {
                    let prevKeypath = validationState.currentKeypath;
                    validationState.currentKeypath = validationState.currentKeypath + `[${key}]`;
                    if (!validator(value)) {
                        if (!validationState.errorKeypatch) {
                            validationState.errorKeypatch = validationState.currentKeypath;
                        }
                        validationState.currentKeypath = prevKeypath;
                        return false;
                    }
                    validationState.currentKeypath = prevKeypath;
                }
                return true;
            }
        ]);
    },
    keys(validator) {
        return addTypeValidators(this, mapTypeProto, true, [
            (map) => {
                for (let [key] of map) {
                    let prevKeypath = validationState.currentKeypath;
                    validationState.currentKeypath = validationState.currentKeypath + `[${key}]`;
                    if (!validator(key)) {
                        if (!validationState.errorKeypatch) {
                            validationState.errorKeypatch = validationState.currentKeypath;
                        }
                        validationState.currentKeypath = prevKeypath;
                        return false;
                    }
                    validationState.currentKeypath = prevKeypath;
                }
                return true;
            }
        ]);
    }
};
