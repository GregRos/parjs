import { ParjsBasicAction } from "../../../base/action";
/**
 * Created by lifeg on 24/11/2016.
 */
export declare class PrsEof extends ParjsBasicAction {
    isLoud: boolean;
    displayName: string;
    expecting: string;
    _apply(ps: ParsingState): void;
}
