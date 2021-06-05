import { addValidator } from '../addValidator';
import { typeProto } from './Type';
export const dateTypeProto = {
    __proto__: typeProto,
    earlier(earlierThanDate) {
        return addValidator(this, true, {
            validator: (date) => date < new Date(earlierThanDate)
        });
    },
    later(laterThanDate) {
        return addValidator(this, true, {
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
