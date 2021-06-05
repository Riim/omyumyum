import { I$Validator } from './State';
import { ITypes } from './Types';
import { IType } from './types/Type';
export declare function addValidator<T extends IType>(type: IType | ITypes, andMode: boolean, validator: I$Validator | Array<I$Validator>, typeProto?: object): T;
