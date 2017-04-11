/**
 * @module parjs/internal/implementation/parsers
 */ /** */
import { ParjsBasicAction } from "../../action";
import { ParsingState } from "../../state";
/**
 * Created by User on 24-Nov-16.
 */
export declare class PrsRegexp extends ParjsBasicAction {
    private regexp;
    displayName: string;
    expecting: string;
    constructor(regexp: RegExp);
    _apply(ps: ParsingState): void;
}
