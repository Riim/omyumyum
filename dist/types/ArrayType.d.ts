import { IType, TValidator } from './Type';
export interface IArrayType extends IType {
    of(validator: TValidator): IArrayType;
    len(value: number): IArrayType;
    minLen(value: number): IArrayType;
    maxLen(value: number): IArrayType;
    nonEmpty: IArrayType;
}
export declare const arrayTypeProto: Object;
