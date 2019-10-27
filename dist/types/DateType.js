import { addTypeValidators } from '../addTypeValidators';
import { typeProto } from './Type';
export const dateTypeProto = {
    __proto__: typeProto,
    earlier(earlierThanDate) {
        return addTypeValidators(this, true, {
            validator: (date) => date < new Date(earlierThanDate)
        });
    },
    later(laterThanDate) {
        return addTypeValidators(this, true, {
            validator: (date) => date > new Date(laterThanDate)
        });
    },
    before(beforeDate) {
        return this.earlier(beforeDate);
    },
    after(afterDate) {
        return this.later(afterDate);
    }
};
