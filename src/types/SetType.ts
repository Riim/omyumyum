import { addTypeValidators } from '../addTypeValidators';
import { validationState } from '../validationState';
import { IType, TSimpleValidator, typeProto } from './Type';

export interface ISetType extends IType {
	of(validator: TSimpleValidator): ISetType;
	nonEmpty: ISetType;
}

export const setTypeProto: Object = {
	__proto__: typeProto,

	of(validator: TSimpleValidator): ISetType {
		return addTypeValidators(this, true, {
			validator: (set: Set<any>) => {
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
		});
	},

	get nonEmpty(): ISetType {
		return addTypeValidators(this, true, { validator: (set: Set<any>) => set.size > 0 });
	}
};
