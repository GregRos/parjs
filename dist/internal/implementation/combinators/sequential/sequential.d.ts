/**
 * @module parjs/internal/implementation/combinators
 */ /** */
import { ParjsAction } from "../../action";
import { ReplyKind } from "../../../../reply";
import { ParsingState } from "../../state";
import { AnyParserAction } from "../../../action";
/**
 * Created by User on 21-Nov-16.
 */
export declare class PrsSeq extends ParjsAction {
    private parsers;
    isLoud: boolean;
    expecting: string;
    constructor(parsers: AnyParserAction[]);
    _apply(ps: ParsingState): ReplyKind;
}
