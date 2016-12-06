import { ParjsAction } from "../../../base/action";
/**
 * Created by lifeg on 24/11/2016.
 */
export declare class PrsMapResult extends ParjsAction {
    private inner;
    private result;
    displayName: string;
    isLoud: boolean;
    expecting: string;
    constructor(inner: AnyParserAction, result: any);
    _apply(ps: ParsingState): void;
}
