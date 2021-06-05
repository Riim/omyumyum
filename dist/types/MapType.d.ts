import { TValidator } from '../State';
import { ITypeProto } from './Type';
export interface IMapType extends IMapTypeProto {
    (value: any): boolean;
}
export interface IMapTypeProto extends ITypeProto {
    keys(validator: TValidator): IMapType;
    values(validator: TValidator): IMapType;
    nonEmpty: IMapType;
}
export declare const mapTypeProto: IMapTypeProto;
