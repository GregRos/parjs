/// <reference types="core-js" />
import { ParjsBasicAction } from "../../../base/action";
import { ParsingState } from "../../../abstract/basics/state";
/**
 * Created by User on 24-Nov-16.
 */
export declare class PrsRegexp extends ParjsBasicAction {
    private regexp;
    displayName: string;
    expecting: string;
    constructor(regexp: RegExp);
    _apply(ps: ParsingState): void;
}
