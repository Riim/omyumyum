import { TValidator } from '../State';
import { ITypeProto } from './Type';
export interface IObjectType extends IObjectTypeProto {
    (value: any): boolean;
}
export interface IObjectTypeProto extends ITypeProto {
    shape(shape: Record<string, TValidator>, exact?: boolean): IObjectType;
    exactShape(shape: Record<string, TValidator>): IObjectType;
    keys(re: RegExp): IObjectType;
    values(validator: TValidator): IObjectType;
    nonEmpty: IObjectType;
}
export declare const objectTypeProto: IObjectTypeProto;
