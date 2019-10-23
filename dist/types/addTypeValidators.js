import { check } from '../check';
import { KEY_STATE } from '../constants';
export function addTypeValidators(type, newTypeProto, andMode, validators) {
    let newType = ((value) => check(newType, value));
    newType.__proto__ = newTypeProto;
    let validators_ = type[KEY_STATE].validators.slice();
    if (andMode) {
        validators_[validators_.length - 1] = [
            ...validators_[validators_.length - 1],
            ...validators
        ];
    }
    else {
        validators_.push(validators);
    }
    newType[KEY_STATE] = { validators: validators_, andMode: false };
    return newType;
}
