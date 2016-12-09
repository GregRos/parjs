import { ParjsBasicAction } from "../../../base/action";
import { ParsingState } from "../../../abstract/basics/state";
/**
 * Created by User on 21-Nov-16.
 */
export declare class PrsRest extends ParjsBasicAction {
    displayName: string;
    isLoud: boolean;
    expecting: string;
    _apply(pr: ParsingState): void;
}
