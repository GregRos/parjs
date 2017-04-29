/**
 * @module parjs/internal/implementation/parsers
 */ /** */
import { ParjsAction } from "../../action";
import { ParsingState } from "../../state";
/**
 * Created by User on 24-Nov-16.
 */
export declare class PrsNewline extends ParjsAction {
    private matchUnicode;
    isLoud: boolean;
    expecting: string;
    constructor(matchUnicode: boolean);
    _apply(ps: ParsingState): void;
}
