import { ParjsAction } from "../../../base/action";
/**
 * Created by User on 21-Nov-16.
 */
export declare class PrsSeq extends ParjsAction {
    private parsers;
    isLoud: boolean;
    displayName: string;
    expecting: string;
    constructor(parsers: AnyParserAction[]);
    _apply(ps: ParsingState): ResultKind;
}
