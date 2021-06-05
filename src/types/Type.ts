import { addValidator } from '../addValidator';
import { KEY_STATE } from '../constants';
import { IState } from '../State';
import { ITypes, typesProto } from '../Types';

export interface IType extends ITypeProto {
	(value: any): boolean;
}

export interface ITypeProto {
	__proto__: Function;
	[KEY_STATE]: IState;
	isOmYumYum: true;
	and: ITypes;
	or: ITypes;
	allow(value: any): IType;
	notAllow(value: any): IType;
	oneOf(values: Array<any>): IType;
	notOneOf(values: Array<any>): IType;
}

export const typeProto: ITypeProto = {
	__proto__: Function.prototype,

	[KEY_STATE]: null as any,

	isOmYumYum: true,

	get and() {
		return {
			__proto__: typesProto,

			[KEY_STATE]: {
				validators: this[KEY_STATE].validators,
				notMode: false,
				andMode: true
			}
		} as any;
	},

	get or() {
		return { __proto__: typesProto, [KEY_STATE]: this[KEY_STATE] } as any;
	},

	allow(value) {
		return addValidator(this, false, { validator: (val) => Object.is(val, value) }, typeProto);
	},

	notAllow(value) {
		return addValidator(this, true, { validator: (val) => !Object.is(val, value) }, typeProto);
	},

	oneOf(values) {
		return addValidator(this, true, { validator: (val) => values.includes(val) }, typeProto);
	},

	notOneOf(values) {
		return addValidator(this, true, { validator: (val) => !values.includes(val) }, typeProto);
	}
};
