import { ParjsAction } from "../../../base/action";
/**
 * Created by User on 21-Nov-16.
 */
export declare class MapParser extends ParjsAction {
    private inner;
    private map;
    displayName: string;
    isLoud: boolean;
    expecting: string;
    constructor(inner: ParjsAction, map: (x: any) => any);
    _apply(ps: ParsingState): void;
}
