import { ParjsAction } from "../../../base/action";
import { ParsingState } from "../../../abstract/basics/state";
export interface FloatOptions {
    allowSign?: boolean;
    allowImplicitZero?: boolean;
    allowFloatingPoint?: boolean;
    allowExponent?: boolean;
}
export declare class PrsFloat extends ParjsAction {
    private options;
    expecting: string;
    displayName: string;
    isLoud: boolean;
    constructor(options: FloatOptions);
    _apply(ps: ParsingState): void;
}
