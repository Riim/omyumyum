import { IType, TValidator } from './Type';
export interface IObjectType extends IType {
    shape(shape: Record<string, TValidator>, exact?: boolean): IType;
    exactShape(shape: Record<string, TValidator>): IType;
    values(validator: TValidator): IType;
}
export declare const objectTypeProto: Object;
