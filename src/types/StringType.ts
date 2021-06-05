import { addValidator } from '../addValidator';
import { isNonZeroLength } from '../lib/utils';
import { ITypeProto, typeProto } from './Type';

export interface IStringType extends IStringTypeProto {
	(value: any): boolean;
}

export interface IStringTypeProto extends ITypeProto {
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

export const stringTypeProto = {
	__proto__: typeProto as any,

	len(value) {
		return addValidator(this, true, { validator: (str: string) => str.length == value });
	},

	minLen(value) {
		return addValidator(this, true, {
			validator: (str: string) => str.length >= value
		});
	},

	maxLen(value) {
		return addValidator(this, true, {
			validator: (str: string) => str.length <= value
		});
	},

	pattern(re) {
		return addValidator(this, true, { validator: (str: string) => re.test(str) });
	},

	matches(re) {
		return this.pattern(re);
	},

	startsWith(searchString, position) {
		return addValidator(this, true, {
			validator: (str: string) => str.startsWith(searchString, position)
		});
	},

	endsWith(searchString, position) {
		return addValidator(this, true, {
			validator: (str: string) => str.endsWith(searchString, position)
		});
	},

	get nonZero() {
		return addValidator(this, true, { validator: isNonZeroLength });
	},

	get nonEmpty() {
		return addValidator(this, true, { validator: isNonEmpty });
	}
} as IStringTypeProto;
