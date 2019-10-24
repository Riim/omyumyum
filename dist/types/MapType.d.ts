import { IType, TValidator } from './Type';
export interface IMapType extends IType {
    of(validator: TValidator): IMapType;
    values(validator: TValidator): IMapType;
    keys(validator: TValidator): IMapType;
    nonEmpty: IMapType;
}
export declare const mapTypeProto: Object;
