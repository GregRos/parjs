import { ParjsAction } from "../../../base/action";
import { AnyParserAction } from "../../../abstract/basics/action";
import { ParsingState } from "../../../abstract/basics/state";
/**
 * Created by lifeg on 24/03/2017.
 */
export declare class PrsLate extends ParjsAction {
    private _resolver;
    displayName: string;
    isLoud: boolean;
    expecting: string;
    private _resolved;
    constructor(_resolver: () => AnyParserAction);
    _apply(ps: ParsingState): void;
}
