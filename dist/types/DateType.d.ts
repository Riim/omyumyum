import { IType } from './Type';
export interface IDateType extends IType {
    earlier(earlierThanDate: Date | string | number): IDateType;
    later(laterThanDate: Date | string | number): IDateType;
    before(beforeDate: Date | string | number): IDateType;
    after(afterDate: Date | string | number): IDateType;
}
export declare const dateTypeProto: Object;
