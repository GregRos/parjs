/**
 * @module parjs/internal/implementation/parsers
 */ /** */
import { ParjsBasicAction } from "../../action";
import { ParsingState } from "../../state";
/**
 * Created by lifeg on 24/11/2016.
 */
export declare class PrsEof extends ParjsBasicAction {
    isLoud: boolean;
    expecting: string;
    _apply(ps: ParsingState): void;
}
