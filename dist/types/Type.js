import { addValidator } from '../addValidator';
import { KEY_STATE } from '../constants';
import { typesProto } from '../Types';
export const typeProto = {
    __proto__: Function.prototype,
    [KEY_STATE]: null,
    isOmYumYum: true,
    get and() {
        return {
            __proto__: typesProto,
            [KEY_STATE]: {
                validators: this[KEY_STATE].validators,
                notMode: false,
                andMode: true
            }
        };
    },
    get or() {
        return { __proto__: typesProto, [KEY_STATE]: this[KEY_STATE] };
    },
    allow(value) {
        return addValidator(this, false, { validator: (val) => Object.is(val, value) }, typeProto);
    },
    notAllow(value) {
        return addValidator(this, true, { validator: (val) => !Object.is(val, value) }, typeProto);
    },
    oneOf(values) {
        return addValidator(this, true, { validator: (val) => values.includes(val) }, typeProto);
    },
    notOneOf(values) {
        return addValidator(this, true, { validator: (val) => !values.includes(val) }, typeProto);
    }
};
