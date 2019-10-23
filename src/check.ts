import { KEY_STATE } from './constants';
import { IType, TValidator } from './types/Type';

export const check = (type: IType, value: any): boolean =>
	type[KEY_STATE].validators.some(cb1, value);

function cb1(this: any, validators: Array<TValidator>): boolean {
	return validators.length == 1 ? validators[0](this) : validators.every(cb2, this);
}

function cb2(this: any, validator: TValidator): boolean {
	return validator(this);
}
