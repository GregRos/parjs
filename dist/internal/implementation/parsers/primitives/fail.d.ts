/**
 * @module parjs/internal/implementation/parsers
 */ /** */
import { ParjsBasicAction } from "../../action";
import { ReplyKind } from "../../../../reply";
import { ParsingState } from "../../state";
/**
 * Created by lifeg on 24/11/2016.
 */
export declare class PrsFail extends ParjsBasicAction {
    private kind;
    expecting: string;
    constructor(kind: ReplyKind, expecting: string);
    _apply(ps: ParsingState): void;
}
