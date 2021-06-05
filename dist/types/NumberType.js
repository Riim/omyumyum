import { addValidator } from '../addValidator';
import { typeProto } from './Type';
const isInteger = (num) => Number.isInteger(num);
export const numberTypeProto = {
    __proto__: typeProto,
    lt(value) {
        return addValidator(this, true, { validator: (num) => num < value });
    },
    less(value) {
        return this.lt(value);
    },
    lte(value) {
        return addValidator(this, true, { validator: (num) => num <= value });
    },
    max(value) {
        return this.lte(value);
    },
    gt(value) {
        return addValidator(this, true, { validator: (num) => num > value });
    },
    greater(value) {
        return this.gt(value);
    },
    gte(value) {
        return addValidator(this, true, { validator: (num) => num >= value });
    },
    min(value) {
        return this.gte(value);
    },
    inRange(minValue, maxValue) {
        return this.gte(minValue).lte(maxValue);
    },
    between(minValue, maxValue) {
        return this.inRange(minValue, maxValue);
    },
    get positive() {
        return this.gte(0);
    },
    get negative() {
        return this.lt(0);
    },
    get integer() {
        return addValidator(this, true, { validator: isInteger });
    }
};
