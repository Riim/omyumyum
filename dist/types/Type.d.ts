import { KEY_STATE } from '../constants';
import { ITypes } from '../Types';
export declare type TSimpleValidator = (value: any) => boolean;
export interface I$Validator {
    validator: TSimpleValidator;
    message?: string;
    type?: string;
}
export declare type TValidator = ((value: any) => boolean | string) | I$Validator;
export interface IState {
    validators: Array<Array<I$Validator>>;
    notMode: boolean;
    andMode: boolean;
}
export interface IType {
    (value: any): boolean;
    [KEY_STATE]: IState;
    and: ITypes;
    or: ITypes;
    allow(value: any): IType;
}
export declare const typeProto: {
    __proto__: Function;
    [KEY_STATE]: null;
    readonly and: ITypes;
    readonly or: ITypes;
    allow(value: any): IType;
};
