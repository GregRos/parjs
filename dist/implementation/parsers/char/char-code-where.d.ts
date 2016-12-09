import { ParjsBasicAction } from "../../../base/action";
import { ParsingState } from "../../../abstract/basics/state";
/**
 * Created by User on 24-Nov-16.
 */
export declare class PrsCharCodeWhere extends ParjsBasicAction {
    private predicate;
    displayName: string;
    isLoud: boolean;
    expecting: string;
    constructor(predicate: (char: number) => boolean, property?: string);
    _apply(ps: ParsingState): void;
}
