import { ParjsAction } from "../../../base/action";
import { ParsingState } from "../../../abstract/basics/state";
/**
 * Created by User on 24-Nov-16.
 */
export declare class PrsNewline extends ParjsAction {
    private matchUnicode;
    displayName: string;
    isLoud: boolean;
    expecting: string;
    constructor(matchUnicode: boolean);
    _apply(ps: ParsingState): void;
}
