import { ParjsBasicAction } from "../../../base/action";
/**
 * Created by User on 21-Nov-16.
 */
export declare class PrsString extends ParjsBasicAction {
    private str;
    displayName: string;
    expecting: string;
    constructor(str: string);
    _apply(ps: ParsingState): void;
}
