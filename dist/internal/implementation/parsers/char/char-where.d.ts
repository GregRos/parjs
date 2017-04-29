/**
 * @module parjs/internal/implementation/parsers
 */ /** */
import { ParjsBasicAction } from "../../action";
import { ParsingState } from "../../state";
/**
 * Created by User on 21-Nov-16.
 */
export declare class PrsCharWhere extends ParjsBasicAction {
    private predicate;
    isLoud: boolean;
    expecting: string;
    constructor(predicate: (char: string) => boolean, expecting?: string);
    _apply(ps: ParsingState): void;
}
