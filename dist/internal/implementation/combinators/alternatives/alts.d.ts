/**
 * @module parjs/internal/implementation/combinators
 */ /** */
import { ParjsAction } from "../../action";
import { AnyParserAction } from "../../../action";
import { ParsingState } from "../../state";
export declare class PrsAlts extends ParjsAction {
    private alts;
    isLoud: boolean;
    expecting: string;
    constructor(alts: AnyParserAction[]);
    _apply(ps: ParsingState): void;
}
