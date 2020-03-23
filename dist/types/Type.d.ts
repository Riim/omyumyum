import { KEY_STATE } from '../constants';
import { ITypes } from '../Types';
export declare type TValidator = (value: any) => boolean;
export interface I$Validator {
    validator: TValidator;
    message?: string;
    type?: string;
}
export interface IState {
    validators: Array<Array<I$Validator>>;
    notMode: boolean;
    andMode: boolean;
}
export interface IType {
    (value: any): boolean;
    [KEY_STATE]: IState;
    isOmYumYum: true;
    and: ITypes;
    or: ITypes;
    allow(value: any): IType;
    notAllow(value: any): IType;
    oneOf(values: Array<any>): IType;
    notOneOf(values: Array<any>): IType;
}
export declare const typeProto: {
    __proto__: Function;
    [KEY_STATE]: null;
    isOmYumYum: boolean;
    readonly and: ITypes;
    readonly or: ITypes;
    allow(value: any): IType;
    notAllow(value: any): IType;
    oneOf(values: any[]): IType;
    notOneOf(values: any[]): IType;
};
