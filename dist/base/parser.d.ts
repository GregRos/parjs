import { ParjsAction } from "./action";
/**
 * Created by User on 22-Nov-16.
 */
/**
 * The base Parjs parser class, which supports only basic parsing operations. Should not be used in user code.
 */
export declare class BaseParjsParser {
    action: ParjsAction;
    constructor(action: ParjsAction);
    parse(input: string): any;
    readonly isLoud: boolean;
}
