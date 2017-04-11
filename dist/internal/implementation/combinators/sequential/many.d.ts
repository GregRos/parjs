/**
 * @module parjs/internal/implementation/combinators
 */ /** */
import { ParjsAction } from "../../action";
import { AnyParserAction } from "../../../action";
import { ParsingState } from "../../state";
/**
 * Created by User on 21-Nov-16.
 */
export declare class PrsMany extends ParjsAction {
    private inner;
    private maxIterations;
    private minSuccesses;
    isLoud: boolean;
    displayName: string;
    expecting: string;
    constructor(inner: AnyParserAction, maxIterations: number, minSuccesses: number);
    _apply(ps: ParsingState): void;
}
