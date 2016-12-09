import { ParjsAction } from "../../../base/action";
import { ParsingState } from "../../../abstract/basics/state";
import { AnyParserAction } from "../../../abstract/basics/action";
/**
 * Created by User on 21-Nov-16.
 */
export declare class PrsMust extends ParjsAction {
    private inner;
    private requirement;
    private failType;
    private qualityName;
    displayName: string;
    isLoud: boolean;
    expecting: string;
    constructor(inner: AnyParserAction, requirement: (result: any) => boolean, failType: any, qualityName: any);
    _apply(ps: ParsingState): void;
}
