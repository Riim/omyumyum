import { addTypeValidators } from '../addTypeValidators';
import { validationState } from '../validationState';
import { typeProto } from './Type';
export const setTypeProto = {
    __proto__: typeProto,
    of(validator) {
        return addTypeValidators(this, true, {
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
        return addTypeValidators(this, true, { validator: (set) => set.size > 0 });
    }
};
