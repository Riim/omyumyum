import { KEY_STATE } from './constants';
import { typesProto } from './Types';
import { validationState } from './validationState';
export function OmYumYum(validator, value) {
    if (arguments.length == 1) {
        return (value) => {
            return om(validator, value);
        };
    }
    validationState.errorMessage = null;
    validationState.errorTypes.length = 0;
    validationState.errorKeypatch = null;
    if (!validator(value)) {
        throw TypeError((validationState.errorMessage ||
            (validationState.errorTypes.length
                ? `Expected type "${validationState.errorTypes.join('" or "')}"`
                : 'Type mismatch')) +
            (validationState.errorKeypatch
                ? validationState.errorMessage
                    ? ` (at "${validationState.errorKeypatch}")`
                    : ` at "${validationState.errorKeypatch}"`
                : ''));
    }
    return value;
}
OmYumYum.__proto__ = typesProto;
OmYumYum[KEY_STATE] = {
    validators: [],
    notMode: false,
    andMode: false
};
export const om = OmYumYum;
export { om as default };
