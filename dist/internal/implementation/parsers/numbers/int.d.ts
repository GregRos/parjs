/**
 * @module parjs/internal/implementation/parsers
 */ /** */
import { ParjsAction } from "../../action";
import { ParsingState } from "../../state";
/**
 * Created by User on 28-Nov-16.
 */
export interface IntOptions {
    allowSign?: boolean;
    base?: number;
}
export declare class PrsInt extends ParjsAction {
    private options;
    isLoud: boolean;
    expecting: string;
    constructor(options: IntOptions);
    _apply(ps: ParsingState): void;
}
