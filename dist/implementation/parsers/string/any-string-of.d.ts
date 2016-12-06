import { ParjsBasicAction } from "../../../base/action";
export declare class AnyStringOf extends ParjsBasicAction {
    private strs;
    displayName: string;
    isLoud: boolean;
    expecting: string;
    constructor(strs: string[]);
    _apply(ps: ParsingState): void;
}
