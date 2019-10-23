import { KEY_STATE } from '../constants';
import { typesProto } from '../Types';
import { addTypeValidators } from './addTypeValidators';
export const typeProto = {
    __proto__: Function.prototype,
    [KEY_STATE]: null,
    get and() {
        let types = {
            __proto__: typesProto,
            [KEY_STATE]: { validators: this[KEY_STATE].validators, andMode: true }
        };
        return types;
    },
    get or() {
        let types = {
            __proto__: typesProto,
            [KEY_STATE]: this[KEY_STATE]
        };
        return types;
    },
    allow(value) {
        return addTypeValidators(this, typeProto, false, [(val) => val === value]);
    }
};
