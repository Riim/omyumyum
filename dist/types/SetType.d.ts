import { TValidator } from '../State';
import { ITypeProto } from './Type';
export interface ISetType extends ISetTypeProto {
    (value: any): boolean;
}
export interface ISetTypeProto extends ITypeProto {
    of(validator: TValidator): ISetType;
    nonEmpty: ISetType;
}
export declare const setTypeProto: ISetTypeProto;
