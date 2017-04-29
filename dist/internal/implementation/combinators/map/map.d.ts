/**
 * @module parjs/internal/implementation/combinators
 */ /** */
import { ParjsAction } from "../../action";
import { ParsingState } from "../../state";
/**
 * Created by User on 21-Nov-16.
 */
export declare class MapParser extends ParjsAction {
    private inner;
    private map;
    isLoud: boolean;
    expecting: string;
    constructor(inner: ParjsAction, map: (x: any, y: any) => any);
    _apply(ps: ParsingState): void;
}
