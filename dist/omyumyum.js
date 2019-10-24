import { KEY_STATE } from './constants';
import { typesProto } from './Types';
import { validationState } from './validationState';
export function OmYumYum(validator, value) {
    if (arguments.length == 1) {
        return (value) => {
            return om(validator, value);
        };
    }
    validationState.errorKeypatch = null;
    if (!validator(value)) {
        if (validationState.errorKeypatch) {
            throw TypeError(`Type mismatch at "${validationState.errorKeypatch}"`);
        }
        throw TypeError('Type mismatch');
    }
    return true;
}
OmYumYum.__proto__ = typesProto;
OmYumYum[KEY_STATE] = {
    validators: [],
    notMode: false,
    andMode: false
};
export const om = OmYumYum;
export { om as default };
