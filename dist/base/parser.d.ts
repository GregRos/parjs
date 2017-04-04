import { ParjsAction } from "./action";
import { ParserResult } from "../abstract/basics/result";
/**
 * Created by User on 22-Nov-16.
 */
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
