import { addTypeValidators } from './addTypeValidators';
import { typeProto } from './Type';
export const numberTypeProto = {
    __proto__: typeProto,
    min(minValue) {
        return addTypeValidators(this, numberTypeProto, true, (num) => num >= minValue);
    },
    max(maxValue) {
        return addTypeValidators(this, numberTypeProto, true, (num) => num <= maxValue);
    },
    less(lessThanValue) {
        return addTypeValidators(this, numberTypeProto, true, (num) => num < lessThanValue);
    },
    greater(greaterThanValue) {
        return addTypeValidators(this, numberTypeProto, true, (num) => num > greaterThanValue);
    },
    between(minValue, maxValue) {
        return this.min(minValue).max(maxValue);
    },
    get positive() {
        return this.min(0);
    },
    get negative() {
        return addTypeValidators(this, numberTypeProto, true, (num) => num < 0);
    },
    get integer() {
        return addTypeValidators(this, numberTypeProto, true, (num) => Number.isInteger(num));
    }
};
