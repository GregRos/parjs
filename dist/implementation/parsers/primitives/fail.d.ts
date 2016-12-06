import { ParjsBasicAction } from "../../../base/action";
/**
 * Created by lifeg on 24/11/2016.
 */
export declare class PrsFail extends ParjsBasicAction {
    displayName: string;
    expecting: string;
    _apply(ps: ParsingState): void;
}
