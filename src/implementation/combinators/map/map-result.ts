import {JaseParserAction} from "../../../base/parser-action";
/**
 * Created by lifeg on 24/11/2016.
 */
export class PrsMapResult extends JaseParserAction {
    displayName = "result";
    isLoud = true;
    constructor(private inner : AnyParserAction, private _result : any) {super()}

    _apply(ps : ParsingState) {
        let {inner, _result} = this;
        if (!inner.apply(ps)) {
            return false;
        }
        ps.result = _result;
        return true;
    }
}