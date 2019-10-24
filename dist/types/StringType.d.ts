import { IType } from './Type';
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
export declare const stringTypeProto: Object;
