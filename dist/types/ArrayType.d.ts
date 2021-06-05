import { TValidator } from '../State';
import { ITypeProto } from './Type';
export interface IArrayType extends IArrayTypeProto {
    (value: any): boolean;
}
export interface IArrayTypeProto extends ITypeProto {
    of(validator: TValidator): IArrayType;
    len(value: number): IArrayType;
    minLen(value: number): IArrayType;
    maxLen(value: number): IArrayType;
    nonEmpty: IArrayType;
}
export declare const arrayTypeProto: IArrayTypeProto;
