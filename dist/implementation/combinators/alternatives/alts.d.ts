import { ParjsAction } from "../../../base/action";
/**
 * Created by User on 21-Nov-16.
 */
export declare class PrsAlts extends ParjsAction {
    private alts;
    isLoud: boolean;
    displayName: string;
    expecting: string;
    constructor(alts: AnyParserAction[]);
    _apply(ps: ParsingState): void;
}
