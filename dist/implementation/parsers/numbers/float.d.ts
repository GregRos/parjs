import { ParjsAction } from "../../../base/action";
export interface FloatOptions {
    allowSign?: boolean;
    allowImplicitZero?: boolean;
    allowFloatingPoint?: boolean;
    allowExponent?: boolean;
    base?: number;
}
export declare class PrsFloat extends ParjsAction {
    private options;
    expecting: string;
    displayName: string;
    isLoud: boolean;
    constructor(options: FloatOptions);
    _apply(ps: ParsingState): void;
}
