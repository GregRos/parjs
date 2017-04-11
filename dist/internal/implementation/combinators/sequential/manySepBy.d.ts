/**
 * @module parjs/internal/implementation/combinators
 */ /** */
import { ParjsAction } from "../../action";
import { AnyParserAction } from "../../../action";
import { ParsingState } from "../../state";
/**
 * Created by User on 21-Nov-16.
 */
export declare class PrsManySepBy extends ParjsAction {
    private many;
    private sep;
    private maxIterations;
    isLoud: boolean;
    displayName: string;
    expecting: string;
    constructor(many: AnyParserAction, sep: AnyParserAction, maxIterations: number);
    _apply(ps: ParsingState): void;
}
