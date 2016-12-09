import { ParjsAction } from "../../../base/action";
import { AnyParserAction } from "../../../abstract/basics/action";
import { ParsingState } from "../../../abstract/basics/state";
/**
 * Created by lifeg on 23/11/2016.
 */
export declare class PrsAltVal extends ParjsAction {
    private inner;
    private val;
    displayName: string;
    isLoud: boolean;
    expecting: string;
    constructor(inner: AnyParserAction, val: any);
    _apply(ps: ParsingState): void;
}
