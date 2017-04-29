/**
 * @module parjs/internal/implementation/combinators
 */ /** */
import { ParjsAction } from "../../action";
import { AnyParserAction } from "../../../action";
import { ParsingState } from "../../state";
/**
 * Created by lifeg on 24/11/2016.
 */
export declare class PrsMapResult extends ParjsAction {
    private inner;
    private result;
    isLoud: boolean;
    expecting: string;
    constructor(inner: AnyParserAction, result: any);
    _apply(ps: ParsingState): void;
}
