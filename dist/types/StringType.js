import { addTypeValidators } from './addTypeValidators';
import { typeProto } from './Type';
export const stringTypeProto = {
    __proto__: typeProto,
    get nonZero() {
        return addTypeValidators(this, true, (str) => str.length > 0);
    },
    get nonEmpty() {
        return addTypeValidators(this, true, (str) => /\S/.test(str));
    },
    len(length) {
        return addTypeValidators(this, true, (str) => str.length == length);
    },
    min(minLength) {
        return addTypeValidators(this, true, (str) => str.length >= minLength);
    },
    max(maxVength) {
        return addTypeValidators(this, true, (str) => str.length <= maxVength);
    },
    pattern(re) {
        return addTypeValidators(this, true, (str) => re.test(str));
    },
    matches(re) {
        return this.pattern(re);
    },
    startsWith(searchString, position) {
        return addTypeValidators(this, true, (str) => str.startsWith(searchString, position));
    },
    endsWith(searchString, position) {
        return addTypeValidators(this, true, (str) => str.endsWith(searchString, position));
    }
};
