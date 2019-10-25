import { addTypeValidators } from '../addTypeValidators';
import { IType, typeProto } from './Type';

export interface IDateType extends IType {
	before(beforeDate: Date | string | number): IDateType;
	after(afterDate: Date | string | number): IDateType;
}

export const dateTypeProto: Object = {
	__proto__: typeProto,

	before(beforeDate: Date | string | number): IDateType {
		return addTypeValidators(this, true, {
			validator: (date: Date) => date < new Date(beforeDate)
		});
	},

	after(afterDate: Date | string | number): IDateType {
		return addTypeValidators(this, true, {
			validator: (date: Date) => date > new Date(afterDate)
		});
	}
};
