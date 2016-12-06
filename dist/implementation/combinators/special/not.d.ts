import { ParjsAction } from "../../../base/action";
/**
 * Created by User on 22-Nov-16.
 */
export declare class PrsNot extends ParjsAction {
    private inner;
    displayName: string;
    isLoud: boolean;
    expecting: string;
    constructor(inner: AnyParserAction);
    _apply(ps: ParsingState): void;
}
