/**
 * @module parjs/internal/implementation/parsers
 */ /** */
import { ParjsAction } from "../../action";
import { ParsingState } from "../../state";
/**
 * Created by User on 27-Nov-16.
 */
export declare class PrsPosition extends ParjsAction {
    isLoud: boolean;
    expecting: string;
    _apply(ps: ParsingState): void;
}
