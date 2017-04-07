import { ParjsAction } from "../../../base/action";
import { AnyParserAction } from "../../../abstract/basics/action";
import { ParsingState } from "../../../abstract/basics/state";
/**
 * Created by lifeg on 24/03/2017.
 */
export declare class PrsLate extends ParjsAction {
    private _resolver;
    isLoud: boolean;
    displayName: string;
    expecting: string;
    private _resolved;
    constructor(_resolver: () => AnyParserAction, isLoud: boolean);
    _apply(ps: ParsingState): void;
}
