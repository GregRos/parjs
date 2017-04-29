/**
 * @module parjs/internal/implementation/combinators
 */ /** */
import { ParjsAction } from "../../action";
import { ParsingState } from "../../state";
export declare class ActParser extends ParjsAction {
    private inner;
    private act;
    expecting: string;
    readonly isLoud: boolean;
    constructor(inner: ParjsAction, act: (result: any, state: any) => void);
    _apply(ps: ParsingState): void;
}
