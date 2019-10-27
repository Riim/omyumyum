import { addTypeValidators } from '../addTypeValidators';
import { typeProto } from './Type';
export const numberTypeProto = {
    __proto__: typeProto,
    lt(value) {
        return addTypeValidators(this, true, { validator: (num) => num < value });
    },
    less(value) {
        return this.lt(value);
    },
    lte(value) {
        return addTypeValidators(this, true, { validator: (num) => num <= value });
    },
    max(value) {
        return this.lte(value);
    },
    gt(value) {
        return addTypeValidators(this, true, { validator: (num) => num > value });
    },
    greater(value) {
        return this.gt(value);
    },
    gte(value) {
        return addTypeValidators(this, true, { validator: (num) => num >= value });
    },
    min(value) {
        return this.gte(value);
    },
    between(minValue, maxValue) {
        return this.gte(minValue).lte(maxValue);
    },
    get positive() {
        return this.min(0);
    },
    get negative() {
        return addTypeValidators(this, true, { validator: (num) => num < 0 });
    },
    get integer() {
        return addTypeValidators(this, true, { validator: (num) => Number.isInteger(num) });
    }
};
