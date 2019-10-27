import { IType, TValidator } from './Type';
export interface IObjectType extends IType {
    shape(shape: Record<string, TValidator>, exact?: boolean): IObjectType;
    exactShape(shape: Record<string, TValidator>): IObjectType;
    keys(re: RegExp): IObjectType;
    values(validator: TValidator): IObjectType;
    nonEmpty: IObjectType;
}
export declare const objectTypeProto: Object;
