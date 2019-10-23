import { KEY_STATE } from '../constants';
import { ITypes } from '../Types';
export declare type TValidator = (value: any) => boolean;
export interface IState {
    validators: Array<Array<TValidator>>;
    andMode: boolean;
}
export interface IType {
    (value: any): boolean;
    [KEY_STATE]: IState;
    and: ITypes;
    or: ITypes;
}
export declare const typeProto: {
    __proto__: Function;
    [KEY_STATE]: null;
    readonly and: ITypes;
    readonly or: ITypes;
    allow(value: any): IType;
};
