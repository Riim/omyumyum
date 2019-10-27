import { IType, TValidator } from './Type';
export interface IMapType extends IType {
    keys(validator: TValidator): IMapType;
    values(validator: TValidator): IMapType;
    nonEmpty: IMapType;
}
export declare const mapTypeProto: Object;
