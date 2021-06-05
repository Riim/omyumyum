import { addValidator } from '../addValidator';
import { ITypeProto, typeProto } from './Type';

export interface IDateType extends IDateTypeProto {
	(value: any): boolean;
}

export interface IDateTypeProto extends ITypeProto {
	earlier(earlierThanDate: Date | string | number): IDateType;
	later(laterThanDate: Date | string | number): IDateType;
	before(beforeDate: Date | string | number): IDateType;
	after(afterDate: Date | string | number): IDateType;
}

export const dateTypeProto = {
	__proto__: typeProto as any,

	earlier(earlierThanDate) {
		return addValidator(this, true, {
			validator: (date: Date) => date < new Date(earlierThanDate)
		});
	},

	later(laterThanDate) {
		return addValidator(this, true, {
			validator: (date: Date) => date > new Date(laterThanDate)
		});
	},

	before(beforeDate) {
		return this.earlier(beforeDate);
	},

	after(afterDate) {
		return this.later(afterDate);
	}
} as IDateTypeProto;
