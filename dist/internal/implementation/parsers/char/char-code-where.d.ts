/**
 * @module parjs/internal/implementation/parsers
 */ /** */
import { ParjsBasicAction } from "../../action";
import { ParsingState } from "../../state";
/**
 * Created by User on 24-Nov-16.
 */
export declare class PrsCharCodeWhere extends ParjsBasicAction {
    private predicate;
    isLoud: boolean;
    expecting: string;
    constructor(predicate: (char: number) => boolean, property?: string);
    _apply(ps: ParsingState): void;
}
