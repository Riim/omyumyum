import { addTypeValidators } from '../addTypeValidators';
import { IType, typeProto } from './Type';

export interface IDateType extends IType {
	earlier(earlierThanDate: Date | string | number): IDateType;
	later(laterThanDate: Date | string | number): IDateType;
	before(beforeDate: Date | string | number): IDateType;
	after(afterDate: Date | string | number): IDateType;
}

export const dateTypeProto: Object = {
	__proto__: typeProto,

	earlier(earlierThanDate: Date | string | number): IDateType {
		return addTypeValidators(this, true, {
			validator: (date: Date) => date < new Date(earlierThanDate)
		});
	},

	later(laterThanDate: Date | string | number): IDateType {
		return addTypeValidators(this, true, {
			validator: (date: Date) => date > new Date(laterThanDate)
		});
	},

	before(beforeDate: Date | string | number): IDateType {
		return this.earlier(beforeDate);
	},

	after(afterDate: Date | string | number): IDateType {
		return this.later(afterDate);
	}
};
