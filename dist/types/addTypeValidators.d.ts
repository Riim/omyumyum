import { ITypes } from '../Types';
import { IType, TValidator } from './Type';
export declare function addTypeValidators<T extends IType>(type: IType | ITypes, newTypeProto: object, andMode: boolean, validator: TValidator | Array<TValidator>): T;
