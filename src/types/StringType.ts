import { addTypeValidators } from '../addTypeValidators';
import { IType, typeProto } from './Type';

export interface IStringType extends IType {
	nonZero: IStringType;
	nonEmpty: IStringType;
	len(length: number): IStringType;
	min(minLength: number): IStringType;
	max(maxVength: number): IStringType;
	pattern(re: RegExp): IStringType;
	matches(re: RegExp): IStringType;
	startsWith(searchString: string, position?: number): IStringType;
	endsWith(searchString: string, position?: number): IStringType;
}

export const stringTypeProto: Object = {
	__proto__: typeProto,

	get nonZero(): IStringType {
		return addTypeValidators(this, true, (str: string) => str.length > 0);
	},

	get nonEmpty(): IStringType {
		return addTypeValidators(this, true, (str: string) => /\S/.test(str));
	},

	len(length: number): IStringType {
		return addTypeValidators(this, true, (str: string) => str.length == length);
	},

	min(minLength: number): IStringType {
		return addTypeValidators(this, true, (str: string) => str.length >= minLength);
	},

	max(maxVength: number): IStringType {
		return addTypeValidators(this, true, (str: string) => str.length <= maxVength);
	},

	pattern(re: RegExp): IStringType {
		return addTypeValidators(this, true, (str: string) => re.test(str));
	},

	matches(re: RegExp): IStringType {
		return this.pattern(re);
	},

	startsWith(searchString: string, position?: number): IStringType {
		return addTypeValidators(this, true, (str: string) =>
			str.startsWith(searchString, position)
		);
	},

	endsWith(searchString: string, position?: number): IStringType {
		return addTypeValidators(this, true, (str: string) => str.endsWith(searchString, position));
	}
};
