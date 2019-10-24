import { ITypes } from '../Types';
import { IType, TValidator } from './Type';
export declare function addTypeValidators<T extends IType>(type: IType | ITypes, andMode: boolean, validator: TValidator | Array<TValidator>, typeProto?: object): T;
