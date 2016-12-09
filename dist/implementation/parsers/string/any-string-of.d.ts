import { ParjsBasicAction } from "../../../base/action";
import { ParsingState } from "../../../abstract/basics/state";
export declare class AnyStringOf extends ParjsBasicAction {
    private strs;
    displayName: string;
    isLoud: boolean;
    expecting: string;
    constructor(strs: string[]);
    _apply(ps: ParsingState): void;
}
