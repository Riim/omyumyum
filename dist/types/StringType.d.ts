import { IType } from './Type';
export interface IStringType extends IType {
    nonZero: IStringType;
    nonEmpty: IStringType;
    min(minLength: number): IStringType;
    max(maxVength: number): IStringType;
    match(re: RegExp): IStringType;
}
export declare const stringTypeProto: Object;
