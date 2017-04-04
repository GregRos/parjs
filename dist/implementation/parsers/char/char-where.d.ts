import { ParjsBasicAction } from "../../../base/action";
import { ParsingState } from "../../../abstract/basics/state";
/**
 * Created by User on 21-Nov-16.
 */
export declare class PrsCharWhere extends ParjsBasicAction {
    private predicate;
    displayName: string;
    isLoud: boolean;
    expecting: string;
    constructor(predicate: (char: string) => boolean, expecting?: string);
    _apply(ps: ParsingState): void;
}
