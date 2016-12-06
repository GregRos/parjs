import { ParjsAction } from "../../../base/action";
/**
 * Created by User on 21-Nov-16.
 */
export declare class PrsMany extends ParjsAction {
    private inner;
    private maxIterations;
    private minSuccesses;
    isLoud: boolean;
    displayName: string;
    expecting: string;
    constructor(inner: AnyParserAction, maxIterations: number, minSuccesses: number);
    _apply(ps: ParsingState): ResultKind;
}
