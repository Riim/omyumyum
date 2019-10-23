import { addTypeValidators } from './addTypeValidators';
import { IType, typeProto } from './Type';

export interface IStringType extends IType {
	nonZero: IStringType;
	nonEmpty: IStringType;
	min(minLength: number): IStringType;
	max(maxVength: number): IStringType;
	match(re: RegExp): IStringType;
}

export const stringTypeProto: Object = {
	__proto__: typeProto,

	get nonZero(): IStringType {
		return addTypeValidators(this, stringTypeProto, true, [(str: string) => str.length > 0]);
	},

	get nonEmpty(): IStringType {
		return addTypeValidators(this, stringTypeProto, true, [(str: string) => /\S/.test(str)]);
	},

	min(minLength: number): IStringType {
		return addTypeValidators(this, stringTypeProto, true, [
			(str: string) => str.length >= minLength
		]);
	},

	max(maxVength: number): IStringType {
		return addTypeValidators(this, stringTypeProto, true, [
			(str: string) => str.length <= maxVength
		]);
	},

	match(re: RegExp): IStringType {
		return addTypeValidators(this, stringTypeProto, true, [(str: string) => re.test(str)]);
	}
};
