/**
 * @module parjs/internal/implementation/parsers
 */ /** */
import { ParjsAction } from "../../action";
import { ParsingState } from "../../state";
export interface FloatOptions {
    allowSign?: boolean;
    allowImplicitZero?: boolean;
    allowFloatingPoint?: boolean;
    allowExponent?: boolean;
}
export declare class PrsFloat extends ParjsAction {
    private options;
    expecting: string;
    isLoud: boolean;
    constructor(options: FloatOptions);
    _apply(ps: ParsingState): void;
}
