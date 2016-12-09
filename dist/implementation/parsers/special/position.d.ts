import { ParjsAction } from "../../../base/action";
import { ParsingState } from "../../../abstract/basics/state";
/**
 * Created by User on 27-Nov-16.
 */
export declare class PrsPosition extends ParjsAction {
    displayName: string;
    isLoud: boolean;
    expecting: string;
    _apply(ps: ParsingState): void;
}
