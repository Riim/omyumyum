import { IType, TSimpleValidator } from './Type';
export interface IArrayType extends IType {
    of(validator: TSimpleValidator): IArrayType;
    nonEmpty: IArrayType;
}
export declare const arrayTypeProto: Object;
