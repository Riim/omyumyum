import { addValidator } from '../addValidator';
import { isNonZeroSize } from '../lib/utils';
import { TValidator } from '../State';
import { validationState } from '../validationState';
import { ITypeProto, typeProto } from './Type';

export interface IMapType extends IMapTypeProto {
	(value: any): boolean;
}

export interface IMapTypeProto extends ITypeProto {
	keys(validator: TValidator): IMapType;
	values(validator: TValidator): IMapType;
	nonEmpty: IMapType;
}

export const mapTypeProto = {
	__proto__: typeProto as any,

	keys(validator) {
		return addValidator(this, true, {
			validator: (map: Map<any, any>) => {
				for (let [key] of map) {
					let prevKeypath = validationState.currentKeypath;
					validationState.currentKeypath = validationState.currentKeypath + `[${key}]`;

					if (!validator(key)) {
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

	values(validator) {
		return addValidator(this, true, {
			validator: (map: Map<any, any>) => {
				for (let [key, value] of map) {
					let prevKeypath = validationState.currentKeypath;
					validationState.currentKeypath = validationState.currentKeypath + `[${key}]`;

					if (!validator(value)) {
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
} as IMapTypeProto;
