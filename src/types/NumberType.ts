import { addTypeValidators } from '../addTypeValidators';
import { IType, typeProto } from './Type';

export interface INumberType extends IType {
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

export const numberTypeProto: Object = {
	__proto__: typeProto,

	lt(value: number): INumberType {
		return addTypeValidators(this, true, { validator: (num: number) => num < value });
	},

	less(value: number): INumberType {
		return this.lt(value);
	},

	lte(value: number): INumberType {
		return addTypeValidators(this, true, { validator: (num: number) => num <= value });
	},

	max(value: number): INumberType {
		return this.lte(value);
	},

	gt(value: number): INumberType {
		return addTypeValidators(this, true, { validator: (num: number) => num > value });
	},

	greater(value: number): INumberType {
		return this.gt(value);
	},

	gte(value: number): INumberType {
		return addTypeValidators(this, true, { validator: (num: number) => num >= value });
	},

	min(value: number): INumberType {
		return this.gte(value);
	},

	inRange(minValue: number, maxValue: number): INumberType {
		return this.gte(minValue).lte(maxValue);
	},

	between(minValue: number, maxValue: number): INumberType {
		return this.inRange(minValue, maxValue);
	},

	get positive(): INumberType {
		return this.min(0);
	},

	get negative(): INumberType {
		return addTypeValidators(this, true, { validator: (num: number) => num < 0 });
	},

	get integer(): INumberType {
		return addTypeValidators(this, true, { validator: (num: number) => Number.isInteger(num) });
	}
};
