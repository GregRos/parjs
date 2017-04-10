import { ParjsAction } from "../../../base/action";
import { AnyParserAction } from "../../../abstract/basics/action";
import { ReplyKind } from "../../../abstract/basics/result";
import { ParsingState } from "../../../abstract/basics/state";
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
