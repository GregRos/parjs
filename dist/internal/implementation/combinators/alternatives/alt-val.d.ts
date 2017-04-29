/**
 * @module parjs/internal/implementation/combinators
 */ /** */
import { ParjsAction } from "../../action";
import { AnyParserAction } from "../../../action";
import { ParsingState } from "../../state";
export declare class PrsAltVal extends ParjsAction {
    private inner;
    private val;
    isLoud: boolean;
    expecting: string;
    constructor(inner: AnyParserAction, val: any);
    _apply(ps: ParsingState): void;
}
