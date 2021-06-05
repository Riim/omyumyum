import { ITypeProto } from './Type';
export interface INumberType extends INumberTypeProto {
    (value: any): boolean;
}
export interface INumberTypeProto extends ITypeProto {
    lt(value: number): INumberType;
    less(value: number): INumberType;
    lte(value: number): INumberType;
    max(value: number): INumberType;
    gt(value: number): INumberType;
    greater(value: number): INumberType;
    gte(value: number): INumberType;
    min(value: number): INumberType;
    inRange(minValue: number, maxValue: number): INumberType;
    between(minValue: number, maxValue: number): INumberType;
    positive: INumberType;
    negative: INumberType;
    integer: INumberType;
}
export declare const numberTypeProto: INumberTypeProto;
