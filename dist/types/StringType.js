import { addTypeValidators } from './addTypeValidators';
import { typeProto } from './Type';
export const stringTypeProto = {
    __proto__: typeProto,
    get nonZero() {
        return addTypeValidators(this, stringTypeProto, true, (str) => str.length > 0);
    },
    get nonEmpty() {
        return addTypeValidators(this, stringTypeProto, true, (str) => /\S/.test(str));
    },
    len(length) {
        return addTypeValidators(this, stringTypeProto, true, (str) => str.length == length);
    },
    min(minLength) {
        return addTypeValidators(this, stringTypeProto, true, (str) => str.length >= minLength);
    },
    max(maxVength) {
        return addTypeValidators(this, stringTypeProto, true, (str) => str.length <= maxVength);
    },
    pattern(re) {
        return addTypeValidators(this, stringTypeProto, true, (str) => re.test(str));
    }
};
