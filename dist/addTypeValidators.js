import { check } from './check';
import { KEY_STATE } from './constants';
export function addTypeValidators(type, andMode, validator, typeProto) {
    if (type[KEY_STATE].notMode) {
        validator = {
            validator: (validator => (value) => !validator(value))(validator.validator),
            message: validator.message,
            type: validator.type
        };
    }
    let newType = ((value) => check(newType, value));
    newType.__proto__ = typeProto || type.__proto__;
    let validators = type[KEY_STATE].validators.slice();
    if (andMode) {
        let validators_ = (validators[validators.length - 1] = validators[validators.length - 1].slice());
        if (Array.isArray(validator)) {
            validators_.push(...validator);
        }
        else {
            validators_.push(validator);
        }
    }
    else {
        validators.push(Array.isArray(validator) ? validator : [validator]);
    }
    newType[KEY_STATE] = {
        validators,
        notMode: false,
        andMode: false
    };
    return newType;
}
