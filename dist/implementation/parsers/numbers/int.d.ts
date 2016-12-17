import { ParjsAction } from "../../../base/action";
import { ParsingState } from "../../../abstract/basics/state";
/**
 * Created by User on 28-Nov-16.
 */
export interface IntOptions {
    allowSign?: boolean;
    base?: number;
}
export declare class PrsInt extends ParjsAction {
    private options;
    displayName: string;
    isLoud: boolean;
    expecting: string;
    constructor(options: IntOptions);
    _apply(ps: ParsingState): void;
}
