import { validationState } from '../validationState';
import { addTypeValidators } from './addTypeValidators';
import { IType, TValidator, typeProto } from './Type';

export interface ISetType extends IType {
	of(validator: TValidator): ISetType;
}

export const setTypeProto: Object = {
	__proto__: typeProto,

	of(validator: TValidator): ISetType {
		return addTypeValidators(this, setTypeProto, true, [
			(set: Set<any>) => {
				let index = 0;

				for (let item of set) {
					let prevKeypath = validationState.currentKeypath;
					validationState.currentKeypath =
						validationState.currentKeypath + `[${index++}]`;

					if (!validator(item)) {
						if (!validationState.errorKeypatch) {
							validationState.errorKeypatch = validationState.currentKeypath;
						}

						validationState.currentKeypath = prevKeypath;

						return false;
					}

					validationState.currentKeypath = prevKeypath;
				}

				return true;
			}
		]);
	}
};
