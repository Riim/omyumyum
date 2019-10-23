import { IType, TValidator } from './Type';
export interface IMapType extends IType {
    of(validator: TValidator): IMapType;
    values(validator: TValidator): IMapType;
    keys(validator: TValidator): IMapType;
}
export declare const mapTypeProto: Object;
