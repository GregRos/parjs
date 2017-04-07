import { ParjsAction } from "../../../base/action";
import { ParsingState } from "../../../abstract/basics/state";
import { AnyParserAction } from "../../../abstract/basics/action";
import { AnyParser } from "../../../abstract/combinators/any";
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
