import { addValidator } from '../addValidator';
import { ITypeProto, typeProto } from './Type';

export interface INumberType extends INumberTypeProto {
	(value: any): boolean;
}

export interface INumberTypeProto extends ITypeProto {
	lt(value: number): INumberType;
	less(value: number): INumberType;
	lte(value: number): INumberType;
	max(value: number): INumberType;
	gt(value: number): INumberType;
	greater(value: number): INumberType;
	gte(value: number): INumberType;
	min(value: number): INumberType;
	inRange(minValue: number, maxValue: number): INumberType;
	between(minValue: number, maxValue: number): INumberType;
	positive: INumberType;
	negative: INumberType;
	integer: INumberType;
}

const isInteger = (num: number): boolean => Number.isInteger(num);

export const numberTypeProto = {
	__proto__: typeProto as any,

	lt(value: number) {
		return addValidator(this, true, { validator: (num: number) => num < value });
	},

	less(value) {
		return this.lt(value);
	},

	lte(value) {
		return addValidator(this, true, { validator: (num: number) => num <= value });
	},

	max(value) {
		return this.lte(value);
	},

	gt(value) {
		return addValidator(this, true, { validator: (num: number) => num > value });
	},

	greater(value) {
		return this.gt(value);
	},

	gte(value) {
		return addValidator(this, true, { validator: (num: number) => num >= value });
	},

	min(value) {
		return this.gte(value);
	},

	inRange(minValue, maxValue) {
		return this.gte(minValue).lte(maxValue);
	},

	between(minValue, maxValue) {
		return this.inRange(minValue, maxValue);
	},

	get positive() {
		return this.gte(0);
	},

	get negative() {
		return this.lt(0);
	},

	get integer() {
		return addValidator(this, true, { validator: isInteger });
	}
} as INumberTypeProto;
