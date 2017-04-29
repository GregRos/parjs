/**
 * @module parjs/internal/implementation/combinators
 */ /** */
import { ParjsAction } from "../../action";
import { AnyParserAction } from "../../../action";
import { ParsingState } from "../../state";
/**
 * Created by User on 21-Nov-16.
 */
export declare class PrsManyTill extends ParjsAction {
    private many;
    private till;
    private tillOptional;
    isLoud: boolean;
    expecting: string;
    constructor(many: AnyParserAction, till: AnyParserAction, tillOptional: boolean);
    _apply(ps: ParsingState): void;
}
