import { ParjsAction } from "../../../base/action";
import { ParsingState } from "../../../abstract/basics/state";
/**
 * Created by User on 21-Nov-16.
 */
export declare class MapParser extends ParjsAction {
    private inner;
    private map;
    displayName: string;
    isLoud: boolean;
    expecting: string;
    constructor(inner: ParjsAction, map: (x: any, y: any) => any);
    _apply(ps: ParsingState): void;
}
