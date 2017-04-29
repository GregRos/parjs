/**
 * @module parjs/internal/implementation/parsers
 */ /** */
import { ParjsBasicAction } from "../../action";
import { ParsingState } from "../../state";
/**
 * Created by User on 22-Nov-16.
 */
export declare class PrsStringLen extends ParjsBasicAction {
    private length;
    expecting: string;
    constructor(length: number);
    _apply(ps: ParsingState): void;
}
