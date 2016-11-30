import {JaseParserAction} from "../../../base/parser-action";
/**
 * Created by lifeg on 24/11/2016.
 */
export class PrsMapResult extends JaseParserAction {
    displayName = "result";
    isLoud = true;
    constructor(private inner : AnyParserAction, private result : any) {super()}

    _apply(ps : ParsingState) {
        let {inner, result} = this;
        inner.apply(ps);
        if (!ps.result.isOk) {
            return;
        }
        ps.value = result;
    }
}