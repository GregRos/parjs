import { ParjsAction } from "./action";
import { ParserResult } from "../abstract/basics/result";
/**
 * The base Parjs parser class, which supports only basic parsing operations. Should not be used in user code.
 */
export declare abstract class BaseParjsParser {
    action: ParjsAction;
    constructor(action: ParjsAction);
    displayName: string;
    parse(input: string, initialState?: any): ParserResult<any>;
    readonly isLoud: boolean;
}
