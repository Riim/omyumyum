import { IType } from './Type';
export interface IDateType extends IType {
    before(beforeDate: Date | string | number): IDateType;
    after(afterDate: Date | string | number): IDateType;
}
export declare const dateTypeProto: Object;
