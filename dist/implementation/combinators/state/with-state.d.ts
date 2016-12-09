import { ParjsAction } from "../../../base/action";
import { ParsingState } from "../../../abstract/basics/state";
import { AnyParserAction } from "../../../abstract/basics/action";
/**
 * Created by User on 21-Nov-16.
 */
export declare class PrsWithState extends ParjsAction {
    private inner;
    private reducer;
    isLoud: boolean;
    displayName: string;
    expecting: string;
    constructor(inner: AnyParserAction, reducer: (state: any, result: any) => any);
    _apply(ps: ParsingState): void;
}
