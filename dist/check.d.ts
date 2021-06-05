import { I$Validator, IState } from './State';
export declare const check: (state: IState, value: any) => boolean;
export declare const checkCallback: (state: IState, validators: Array<I$Validator>, value: any) => boolean;
export declare const checkCallbackCallback: (state: IState, validator: I$Validator, value: any) => boolean;
