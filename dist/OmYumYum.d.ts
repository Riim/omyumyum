import { TValidator } from './State';
import { ITypes } from './Types';
export { TValidator, I$Validator } from './State';
export { IType } from './types/Type';
export { ITypes, typesProto } from './Types';
export interface IOmYumYum extends ITypes {
    (validator: TValidator): <T = any>(value: T) => T;
    <T = any>(validator: TValidator, value: T): T;
}
export declare function OmYumYum(validator: TValidator): (value: any) => any;
export declare function OmYumYum(validator: TValidator, value: any): any;
export declare const om: IOmYumYum;
export { om as default };
