import { addTypeValidators } from '../addTypeValidators';
import { isNonZeroLength } from '../lib/utils';
import { IType, typeProto } from './Type';

export interface IStringType extends IType {
	len(value: number): IStringType;
	minLen(value: number): IStringType;
	maxLen(value: number): IStringType;
	pattern(re: RegExp): IStringType;
	matches(re: RegExp): IStringType;
	startsWith(searchString: string, position?: number): IStringType;
	endsWith(searchString: string, position?: number): IStringType;
	nonZero: IStringType;
	nonEmpty: IStringType;
}

const isNonEmpty = (str: string): boolean => /\S/.test(str);

export const stringTypeProto: Object = {
	__proto__: typeProto,

	len(value: number): IStringType {
		return addTypeValidators(this, true, { validator: (str: string) => str.length == value });
	},

	minLen(value: number): IStringType {
		return addTypeValidators(this, true, {
			validator: (str: string) => str.length >= value
		});
	},

	maxLen(value: number): IStringType {
		return addTypeValidators(this, true, {
			validator: (str: string) => str.length <= value
		});
	},

	pattern(re: RegExp): IStringType {
		return addTypeValidators(this, true, { validator: (str: string) => re.test(str) });
	},

	matches(re: RegExp): IStringType {
		return this.pattern(re);
	},

	startsWith(searchString: string, position?: number): IStringType {
		return addTypeValidators(this, true, {
			validator: (str: string) => str.startsWith(searchString, position)
		});
	},

	endsWith(searchString: string, position?: number): IStringType {
		return addTypeValidators(this, true, {
			validator: (str: string) => str.endsWith(searchString, position)
		});
	},

	get nonZero(): IStringType {
		return addTypeValidators(this, true, { validator: isNonZeroLength });
	},

	get nonEmpty(): IStringType {
		return addTypeValidators(this, true, { validator: isNonEmpty });
	}
};
