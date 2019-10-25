import { IType, TSimpleValidator } from './Type';
export interface IMapType extends IType {
    of(validator: TSimpleValidator): IMapType;
    values(validator: TSimpleValidator): IMapType;
    keys(validator: TSimpleValidator): IMapType;
    nonEmpty: IMapType;
}
export declare const mapTypeProto: Object;
