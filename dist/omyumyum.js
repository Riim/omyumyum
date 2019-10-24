import { KEY_STATE } from './constants';
import { typesProto } from './Types';
import { validationState } from './validationState';
export const om = ((validator, value) => {
    validationState.errorKeypatch = null;
    if (!validator(value)) {
        if (validationState.errorKeypatch) {
            throw TypeError(`Type mismatch at "${validationState.errorKeypatch}"`);
        }
        throw TypeError('Type mismatch');
    }
    return true;
});
om.__proto__ = typesProto;
om[KEY_STATE] = {
    validators: [],
    notMode: false,
    andMode: false
};
export { om as default };
