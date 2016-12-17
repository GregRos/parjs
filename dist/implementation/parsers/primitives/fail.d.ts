import { ParjsBasicAction } from "../../../base/action";
import { ResultKind } from "../../../abstract/basics/result";
import { ParsingState } from "../../../abstract/basics/state";
/**
 * Created by lifeg on 24/11/2016.
 */
export declare class PrsFail extends ParjsBasicAction {
    private kind;
    expecting: string;
    displayName: string;
    constructor(kind: ResultKind, expecting: string);
    _apply(ps: ParsingState): void;
}
