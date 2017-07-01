/**
 * @module parjs/internal/implementation/combinators
 */ /** */
import {ParjsAction} from "../../action";
import {AnyParserAction} from "../../../action";
import {ParsingState} from "../../state";
import _cloneDeep = require("lodash/clone");
/**
 * Created by lifeg on 24/03/2017.
 */
export class PrsIsolate extends ParjsAction {
    isLoud = true;
    expecting: string;
    constructor(private _inner : AnyParserAction) {
        super();
    };

    _apply(ps : ParsingState) {
        let state = ps.userState;
        ps.userState = _cloneDeep(ps.initialUserState);
        this._inner.apply(ps);
        ps.userState = state;
    }
}