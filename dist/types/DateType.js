import { addTypeValidators } from './addTypeValidators';
import { typeProto } from './Type';
export const dateTypeProto = {
    __proto__: typeProto,
    before(beforeDate) {
        return addTypeValidators(this, dateTypeProto, true, (date) => date < new Date(beforeDate));
    },
    after(afterDate) {
        return addTypeValidators(this, dateTypeProto, true, (date) => date > new Date(afterDate));
    }
};
