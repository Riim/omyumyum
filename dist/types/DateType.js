import { addTypeValidators } from './addTypeValidators';
import { typeProto } from './Type';
export const dateTypeProto = {
    __proto__: typeProto,
    before(beforeDate) {
        return addTypeValidators(this, true, (date) => date < new Date(beforeDate));
    },
    after(afterDate) {
        return addTypeValidators(this, true, (date) => date > new Date(afterDate));
    }
};
