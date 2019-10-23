import { IType } from './Type';
export interface INumberType extends IType {
    min(minValue: number): INumberType;
    max(maxValue: number): INumberType;
    positive: INumberType;
    negative: INumberType;
    integer: INumberType;
}
export declare const numberTypeProto: Object;
