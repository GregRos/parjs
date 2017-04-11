/**
 * @module parjs/internal/implementation/combinators
 */ /** */
import { ParjsAction } from "../../action";
import { ParsingState } from "../../state";
import { AnyParserAction } from "../../../action";
import { AnyParser } from "../../../../any";
/**
 * Created by User on 21-Nov-16.
 */
export declare class PrsSeqFunc extends ParjsAction {
    private initial;
    private selector;
    private cache;
    isLoud: boolean;
    displayName: string;
    expecting: string;
    constructor(initial: AnyParserAction, selector: (result: any) => AnyParser, cache?: Map<any, AnyParser>);
    _apply(ps: ParsingState): void;
}
