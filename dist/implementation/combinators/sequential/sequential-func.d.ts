import { ParjsAction } from "../../../base/action";
/**
 * Created by User on 21-Nov-16.
 */
export declare class PrsSeqFunc extends ParjsAction {
    private initial;
    private parserSelectors;
    isLoud: boolean;
    displayName: string;
    expecting: string;
    constructor(initial: AnyParserAction, parserSelectors: ((result: any) => LoudParser<any>)[]);
    _apply(ps: ParsingState): ResultKind;
}
