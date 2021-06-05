import { KEY_STATE } from '../constants';
import { IState } from '../State';
import { ITypes } from '../Types';
export interface IType extends ITypeProto {
    (value: any): boolean;
}
export interface ITypeProto {
    __proto__: Function;
    [KEY_STATE]: IState;
    isOmYumYum: true;
    and: ITypes;
    or: ITypes;
    allow(value: any): IType;
    notAllow(value: any): IType;
    oneOf(values: Array<any>): IType;
    notOneOf(values: Array<any>): IType;
}
export declare const typeProto: ITypeProto;
