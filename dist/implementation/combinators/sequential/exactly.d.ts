import { ParjsAction } from "../../../base/action";
/**
 * Created by User on 21-Nov-16.
 */
export declare class PrsExactly extends ParjsAction {
    private inner;
    private count;
    isLoud: boolean;
    displayName: string;
    expecting: string;
    constructor(inner: AnyParserAction, count: number);
    _apply(ps: ParsingState): void;
}
