import { IType } from './Type';
export interface INumberType extends IType {
    min(minValue: number): INumberType;
    max(maxValue: number): INumberType;
    less(lessThanValue: number): INumberType;
    greater(greaterThanValue: number): INumberType;
    between(minValue: number, maxValue: number): INumberType;
    positive: INumberType;
    negative: INumberType;
    integer: INumberType;
}
export declare const numberTypeProto: Object;
