import { ITypes } from './Types';
import { I$Validator, IType } from './types/Type';
export declare function addTypeValidators<T extends IType>(type: IType | ITypes, andMode: boolean, validator: I$Validator | Array<I$Validator>, typeProto?: object): T;
