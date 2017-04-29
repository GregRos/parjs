/**
 * @module parjs/internal/implementation/combinators
 */ /** */
import { ParjsAction } from "../../action";
import { ParsingState } from "../../state";
import { AnyParserAction } from "../../../action";
export declare class PrsBacktrack extends ParjsAction {
    private inner;
    isLoud: boolean;
    expecting: string;
    constructor(inner: AnyParserAction);
    _apply(ps: ParsingState): void;
}
