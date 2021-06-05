import { KEY_STATE } from './constants';
import { typesProto } from './Types';
import { validationState } from './validationState';
export { typesProto } from './Types';
export function OmYumYum(validator, value) {
    var _a;
    if (arguments.length == 1) {
        return (value) => {
            return OmYumYum(validator, value);
        };
    }
    validationState.errorMessage = null;
    validationState.errorTypes = null;
    validationState.errorKeypatch = null;
    if (!validator(value)) {
        throw TypeError(((_a = validationState.errorMessage) !== null && _a !== void 0 ? _a : (validationState.errorTypes
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
