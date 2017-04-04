/**
 * Created by lifeg on 02/04/2017.
 */
import { ParjsAction } from "../../../base/action";
import { ParsingState } from "../../../abstract/basics/state";
/**
 * Created by User on 21-Nov-16.
 */
export declare class ActParser extends ParjsAction {
    private inner;
    private act;
    displayName: string;
    expecting: string;
    readonly isLoud: boolean;
    constructor(inner: ParjsAction, act: (result: any, state: any) => void);
    _apply(ps: ParsingState): void;
}
