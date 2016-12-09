import { ParjsAction } from "../../../base/action";
import { ParsingState } from "../../../abstract/basics/state";
/**
 * Created by User on 28-Nov-16.
 */
export declare class PrsInt extends ParjsAction {
    private signed;
    private base;
    displayName: string;
    isLoud: boolean;
    expecting: string;
    constructor(signed: boolean, base: number);
    _apply(ps: ParsingState): void;
}
