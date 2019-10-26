import { KEY_STATE } from './constants';
import { ITypes, typesProto } from './Types';
import { TValidator } from './types/Type';
import { validationState } from './validationState';

export { TValidator, I$Validator, IType } from './types/Type';
export { ITypes } from './Types';

export interface IOmYumYum extends ITypes {
	(validator: TValidator): (value: any) => true;
	(validator: TValidator, value: any): true;
}

export function OmYumYum(validator: TValidator): (value: any) => true;
export function OmYumYum(validator: TValidator, value: any): true;
export function OmYumYum(validator: TValidator, value?: any): any {
	if (arguments.length == 1) {
		return (value: any): true => {
			return om(validator, value);
		};
	}

	validationState.errorMessage = null;
	validationState.errorTypes.length = 0;
	validationState.errorKeypatch = null;

	if (!validator(value)) {
		if (validationState.errorKeypatch) {
			throw TypeError(
				validationState.errorMessage
					? validationState.errorMessage + ` (at "${validationState.errorKeypatch}")`
					: validationState.errorTypes
					? `Expected type "${validationState.errorTypes.join('" or "')}" at "${
							validationState.errorKeypatch
					  }"`
					: `Type mismatch at "${validationState.errorKeypatch}"`
			);
		}

		throw TypeError(
			validationState.errorMessage ||
				(validationState.errorTypes
					? `Expected type "${validationState.errorTypes.join('" or "')}"`
					: 'Type mismatch')
		);
	}

	return true;
}
(OmYumYum as any).__proto__ = typesProto;
OmYumYum[KEY_STATE] = {
	validators: [],
	notMode: false,
	andMode: false
};

export const om: IOmYumYum = OmYumYum as any;
export { om as default };
