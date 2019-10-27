import { addTypeValidators } from '../addTypeValidators';
import { typeProto } from './Type';
export const stringTypeProto = {
    __proto__: typeProto,
    len(value) {
        return addTypeValidators(this, true, { validator: (str) => str.length == value });
    },
    minLen(value) {
        return addTypeValidators(this, true, {
            validator: (str) => str.length >= value
        });
    },
    maxLen(value) {
        return addTypeValidators(this, true, {
            validator: (str) => str.length <= value
        });
    },
    pattern(re) {
        return addTypeValidators(this, true, { validator: (str) => re.test(str) });
    },
    matches(re) {
        return this.pattern(re);
    },
    startsWith(searchString, position) {
        return addTypeValidators(this, true, {
            validator: (str) => str.startsWith(searchString, position)
        });
    },
    endsWith(searchString, position) {
        return addTypeValidators(this, true, {
            validator: (str) => str.endsWith(searchString, position)
        });
    },
    get nonZero() {
        return addTypeValidators(this, true, { validator: (str) => str.length > 0 });
    },
    get nonEmpty() {
        return addTypeValidators(this, true, { validator: (str) => /\S/.test(str) });
    }
};
