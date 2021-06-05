export declare const isNonZeroLength: (obj: {
    length: number;
}) => boolean;
export declare const isNonZeroSize: (obj: {
    size: number;
}) => boolean;
export declare const findLast: <T>(arr: T[], cb: (item: T, index: number) => any) => T | undefined;
