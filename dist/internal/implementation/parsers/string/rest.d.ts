/**
 * @module parjs/internal/implementation/parsers
 */ /** */
import { ParjsBasicAction } from "../../action";
import { ParsingState } from "../../state";
/**
 * Created by User on 21-Nov-16.
 */
export declare class PrsRest extends ParjsBasicAction {
    isLoud: boolean;
    expecting: string;
    _apply(pr: ParsingState): void;
}
