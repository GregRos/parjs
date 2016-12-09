import { ParjsBasicAction } from "../../../base/action";
import { ParsingState } from "../../../abstract/basics/state";
/**
 * Created by User on 22-Nov-16.
 */
export declare class PrsStringLen extends ParjsBasicAction {
    private length;
    displayName: string;
    expecting: string;
    constructor(length: number);
    _apply(ps: ParsingState): void;
}
