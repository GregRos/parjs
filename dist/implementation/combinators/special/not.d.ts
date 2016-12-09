import { ParjsAction } from "../../../base/action";
import { AnyParserAction } from "../../../abstract/basics/action";
import { ParsingState } from "../../../abstract/basics/state";
/**
 * Created by User on 22-Nov-16.
 */
export declare class PrsNot extends ParjsAction {
    private inner;
    displayName: string;
    isLoud: boolean;
    expecting: string;
    constructor(inner: AnyParserAction);
    _apply(ps: ParsingState): void;
}
