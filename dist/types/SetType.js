import { addValidator } from '../addValidator';
import { isNonZeroSize } from '../lib/utils';
import { validationState } from '../validationState';
import { typeProto } from './Type';
export const setTypeProto = {
    __proto__: typeProto,
    of(validator) {
        return addValidator(this, true, {
            validator: (set) => {
                let index = 0;
                for (let item of set) {
                    let prevKeypath = validationState.currentKeypath;
                    validationState.currentKeypath =
                        validationState.currentKeypath + `[${index++}]`;
                    if (!validator(item)) {
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
        });
    },
    get nonEmpty() {
        return addValidator(this, true, { validator: isNonZeroSize });
    }
};
