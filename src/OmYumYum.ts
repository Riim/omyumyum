import { KEY_STATE } from './constants';
import { IState, TValidator } from './State';
import { ITypes, typesProto } from './Types';
import { validationState } from './validationState';

export { TValidator, I$Validator } from './State';
export { IType } from './types/Type';
export { ITypes, typesProto } from './Types';

export interface IOmYumYum extends ITypes {
	(validator: TValidator): <T = any>(value: T) => T;
	<T = any>(validator: TValidator, value: T): T;
}

export function OmYumYum(validator: TValidator): (value: any) => any;
export function OmYumYum(validator: TValidator, value: any): any;
export function OmYumYum(validator: TValidator, value?: any): any {
	if (arguments.length == 1) {
		return (value: any): true => {
			return OmYumYum(validator, value);
		};
	}

	validationState.errorMessage = null;
	validationState.errorTypes = null;
	validationState.errorKeypatch = null;

	if (!validator(value)) {
		throw TypeError(
			(validationState.errorMessage ??
				(validationState.errorTypes
					? `Expected type "${(validationState.errorTypes as Array<string>).join(
							'" or "'
					  )}"`
					: 'Type mismatch')) +
				(validationState.errorKeypatch
					? validationState.errorMessage
						? ` (at "${validationState.errorKeypatch}")`
						: ` at "${validationState.errorKeypatch}"`
					: '')
		);
	}

	return value;
}
(OmYumYum as any).__proto__ = typesProto;
OmYumYum[KEY_STATE] = {
	validators: [],
	notMode: false,
	andMode: false
} as IState;

export const om = OmYumYum as IOmYumYum;
export { om as default };
