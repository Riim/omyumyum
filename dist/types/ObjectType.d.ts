import { IType, TSimpleValidator } from './Type';
export interface IObjectType extends IType {
    shape(shape: Record<string, TSimpleValidator>, exact?: boolean): IObjectType;
    exactShape(shape: Record<string, TSimpleValidator>): IObjectType;
    values(validator: TSimpleValidator): IObjectType;
    nonEmpty: IObjectType;
}
export declare const objectTypeProto: Object;
