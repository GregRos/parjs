import { ParjsBasicAction } from "../../action";
import { ParsingState } from "../../state";
export declare class AnyStringOf extends ParjsBasicAction {
    private strs;
    isLoud: boolean;
    expecting: string;
    constructor(strs: string[]);
    _apply(ps: ParsingState): void;
}
