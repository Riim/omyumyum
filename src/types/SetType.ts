import { addValidator } from '../addValidator';
import { isNonZeroSize } from '../lib/utils';
import { TValidator } from '../State';
import { validationState } from '../validationState';
import { ITypeProto, typeProto } from './Type';

export interface ISetType extends ISetTypeProto {
	(value: any): boolean;
}

export interface ISetTypeProto extends ITypeProto {
	of(validator: TValidator): ISetType;
	nonEmpty: ISetType;
}

export const setTypeProto = {
	__proto__: typeProto as any,

	of(validator) {
		return addValidator(this, true, {
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

	get nonEmpty() {
		return addValidator(this, true, { validator: isNonZeroSize });
	}
} as ISetTypeProto;
