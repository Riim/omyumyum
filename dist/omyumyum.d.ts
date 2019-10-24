import { ITypes } from './Types';
import { TValidator } from './types/Type';
export { ITypes } from './Types';
export { IType, TValidator } from './types/Type';
export interface IOmYumYum extends ITypes {
    (validator: TValidator): (value: any) => true;
    (validator: TValidator, value: any): true;
}
export declare function OmYumYum(validator: TValidator): (value: any) => true;
export declare function OmYumYum(validator: TValidator, value: any): true;
export declare const om: IOmYumYum;
export { om as default };
