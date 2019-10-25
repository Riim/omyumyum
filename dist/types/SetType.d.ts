import { IType, TSimpleValidator } from './Type';
export interface ISetType extends IType {
    of(validator: TSimpleValidator): ISetType;
    nonEmpty: ISetType;
}
export declare const setTypeProto: Object;
