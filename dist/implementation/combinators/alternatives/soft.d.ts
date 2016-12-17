/**
 * Created by User on 13-Dec-16.
 */
import { ParjsAction } from "../../../base/action";
import { AnyParserAction } from "../../../abstract/basics/action";
import { ParsingState } from "../../../abstract/basics/state";
/**
 * Created by User on 21-Nov-16.
 */
export declare class PrsSoft extends ParjsAction {
    private inner;
    isLoud: boolean;
    displayName: string;
    expecting: string;
    constructor(inner: AnyParserAction);
    _apply(ps: ParsingState): void;
}
