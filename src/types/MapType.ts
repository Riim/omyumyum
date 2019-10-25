import { addTypeValidators } from '../addTypeValidators';
import { validationState } from '../validationState';
import { IType, TValidator, typeProto } from './Type';

export interface IMapType extends IType {
	of(validator: TValidator): IMapType;
	values(validator: TValidator): IMapType;
	keys(validator: TValidator): IMapType;
	nonEmpty: IMapType;
}

export const mapTypeProto: Object = {
	__proto__: typeProto,

	of(validator: TValidator): IMapType {
		return addTypeValidators(this, true, {
			validator: (map: Map<any, any>) => {
				for (let entry of map) {
					let prevKeypath = validationState.currentKeypath;
					validationState.currentKeypath =
						validationState.currentKeypath + `[${entry[0]}]`;

					if (!validator(entry)) {
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

	values(validator: TValidator): IMapType {
		return addTypeValidators(this, true, {
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

	keys(validator: TValidator): IMapType {
		return addTypeValidators(this, true, {
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

	get nonEmpty(): IMapType {
		return addTypeValidators(this, true, { validator: (map: Map<any, any>) => map.size > 0 });
	}
};
