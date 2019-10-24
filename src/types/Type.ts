import { KEY_STATE } from '../constants';
import { ITypes, typesProto } from '../Types';
import { addTypeValidators } from './addTypeValidators';

export type TValidator = (value: any) => boolean;

export interface IState {
	validators: Array<Array<TValidator>>;
	notMode: boolean;
	andMode: boolean;
}

export interface IType {
	(value: any): boolean;
	[KEY_STATE]: IState;
	and: ITypes;
	or: ITypes;
	allow(value: any): IType;
}

export const typeProto = {
	__proto__: Function.prototype,

	[KEY_STATE]: null,

	get and(): ITypes {
		let types: ITypes = {
			__proto__: typesProto,

			[KEY_STATE]: {
				validators: this[KEY_STATE].validators,
				notMode: false,
				andMode: true
			}
		} as any;

		return types;
	},

	get or(): ITypes {
		let types: ITypes = { __proto__: typesProto, [KEY_STATE]: this[KEY_STATE] } as any;
		return types;
	},

	allow(value: any): IType {
		return addTypeValidators(this, typeProto, false, (val: any) => Object.is(val, value));
	}
};
