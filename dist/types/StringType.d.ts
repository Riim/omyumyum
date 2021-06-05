import { ITypeProto } from './Type';
export interface IStringType extends IStringTypeProto {
    (value: any): boolean;
}
export interface IStringTypeProto extends ITypeProto {
    len(value: number): IStringType;
    minLen(value: number): IStringType;
    maxLen(value: number): IStringType;
    pattern(re: RegExp): IStringType;
    matches(re: RegExp): IStringType;
    startsWith(searchString: string, position?: number): IStringType;
    endsWith(searchString: string, position?: number): IStringType;
    nonZero: IStringType;
    nonEmpty: IStringType;
}
export declare const stringTypeProto: IStringTypeProto;
