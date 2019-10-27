import { addTypeValidators } from '../addTypeValidators';
import { KEY_STATE } from '../constants';
import { ITypes, typesProto } from '../Types';

export type TValidator = (value: any) => boolean;
export interface I$Validator {
	validator: TValidator;
	message?: string;
	type?: string;
}

export interface IState {
	validators: Array<Array<I$Validator>>;
	notMode: boolean;
	andMode: boolean;
}

export interface IType {
	(value: any): boolean;
	[KEY_STATE]: IState;
	and: ITypes;
	or: ITypes;
	allow(value: any): IType;
	notAllow(value: any): IType;
	oneOf(values: Array<any>): IType;
	notOneOf(values: Array<any>): IType;
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
		return addTypeValidators(
			this,
			false,
			{ validator: (val: any) => Object.is(val, value) },
			typeProto
		);
	},

	notAllow(value: any): IType {
		return addTypeValidators(
			this,
			true,
			{ validator: (val: any) => !Object.is(val, value) },
			typeProto
		);
	},

	oneOf(values: Array<any>): IType {
		return addTypeValidators(
			this,
			false,
			{ validator: (val: any) => values.includes(val) },
			typeProto
		);
	},

	notOneOf(values: Array<any>): IType {
		return addTypeValidators(
			this,
			true,
			{ validator: (val: any) => !values.includes(val) },
			typeProto
		);
	}
};
