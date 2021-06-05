export declare type TValidator = (value: any) => boolean;
export interface I$Validator {
    validator: TValidator;
    message?: string;
    type?: string;
}
export interface IState {
    validators: Array<Array<I$Validator>>;
    notMode: boolean;
    andMode: boolean;
}
