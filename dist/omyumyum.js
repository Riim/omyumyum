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
        if (validationState.errorKeypatch) {
            throw TypeError(validationState.errorMessage
                ? validationState.errorMessage + ` (at "${validationState.errorKeypatch}")`
                : validationState.errorTypes
                    ? `Expected type "${validationState.errorTypes.join('" or "')}" at "${validationState.errorKeypatch}"`
                    : `Type mismatch at "${validationState.errorKeypatch}"`);
        }
        throw TypeError(validationState.errorMessage ||
            (validationState.errorTypes
                ? `Expected type "${validationState.errorTypes.join('" or "')}"`
                : 'Type mismatch'));
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
