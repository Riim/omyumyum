import { IType, TValidator } from './Type';
export interface IArrayType extends IType {
    of(validator: TValidator): IArrayType;
    nonEmpty: IArrayType;
}
export declare const arrayTypeProto: Object;
