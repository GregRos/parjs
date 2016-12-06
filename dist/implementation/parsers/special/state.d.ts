import { ParjsAction } from "../../../base/action";
/**
 * Created by User on 27-Nov-16.
 */
export declare class PrsState extends ParjsAction {
    displayName: string;
    isLoud: boolean;
    expecting: string;
    _apply(ps: ParsingState): void;
}
