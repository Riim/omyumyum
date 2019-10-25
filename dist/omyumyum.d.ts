import { ITypes } from './Types';
import { TSimpleValidator } from './types/Type';
export { TSimpleValidator, I$Validator, TValidator, IType } from './types/Type';
export { ITypes } from './Types';
export interface IOmYumYum extends ITypes {
    (validator: TSimpleValidator): (value: any) => true;
    (validator: TSimpleValidator, value: any): true;
}
export declare function OmYumYum(validator: TSimpleValidator): (value: any) => true;
export declare function OmYumYum(validator: TSimpleValidator, value: any): true;
export declare const om: IOmYumYum;
export { om as default };
