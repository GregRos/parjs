/**
 * @module parjs/internal/implementation/combinators
 */ /** */
import { ParjsAction } from "../../action";
import { AnyParserAction } from "../../../action";
import { ParsingState } from "../../state";
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
