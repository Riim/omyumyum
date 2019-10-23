import { ITypes } from './Types';
import { TValidator } from './types/Type';
export { ITypes } from './Types';
export { IType, TValidator } from './types/Type';
export interface IOmNamNam extends ITypes {
    (validator: TValidator, value: any): true;
}
export declare const om: IOmNamNam;
export { om as default };
