/**
 * @module parjs/internal/implementation/parsers
 */ /** */
import { ParjsBasicAction } from "../../action";
import { ParsingState } from "../../state";
/**
 * Created by User on 21-Nov-16.
 */
export declare class PrsString extends ParjsBasicAction {
    private str;
    expecting: string;
    constructor(str: string);
    _apply(ps: ParsingState): void;
}
