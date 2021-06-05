import { addValidator } from '../addValidator';
import { isNonZeroLength } from '../lib/utils';
import { typeProto } from './Type';
const isNonEmpty = (str) => /\S/.test(str);
export const stringTypeProto = {
    __proto__: typeProto,
    len(value) {
        return addValidator(this, true, { validator: (str) => str.length == value });
    },
    minLen(value) {
        return addValidator(this, true, {
            validator: (str) => str.length >= value
        });
    },
    maxLen(value) {
        return addValidator(this, true, {
            validator: (str) => str.length <= value
        });
    },
    pattern(re) {
        return addValidator(this, true, { validator: (str) => re.test(str) });
    },
    matches(re) {
        return this.pattern(re);
    },
    startsWith(searchString, position) {
        return addValidator(this, true, {
            validator: (str) => str.startsWith(searchString, position)
        });
    },
    endsWith(searchString, position) {
        return addValidator(this, true, {
            validator: (str) => str.endsWith(searchString, position)
        });
    },
    get nonZero() {
        return addValidator(this, true, { validator: isNonZeroLength });
    },
    get nonEmpty() {
        return addValidator(this, true, { validator: isNonEmpty });
    }
};
