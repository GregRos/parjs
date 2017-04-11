/**
 * @module parjs/internal/implementation/combinators
 */ /** */
import { ParjsAction } from "../../action";
import { AnyParserAction } from "../../../action";
import { ReplyKind } from "../../../../reply";
import { ParsingState } from "../../state";
/**
 * Created by User on 21-Nov-16.
 */
export declare class PrsMustCapture extends ParjsAction {
    private inner;
    private failType;
    displayName: string;
    isLoud: boolean;
    expecting: string;
    constructor(inner: AnyParserAction, failType: ReplyKind);
    _apply(ps: ParsingState): void;
}
