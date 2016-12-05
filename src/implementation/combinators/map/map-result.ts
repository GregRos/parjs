import {JaseParserAction} from "../../../base/parser-action";
/**
 * Created by lifeg on 24/11/2016.
 */
export class PrsMapResult extends JaseParserAction {
    displayName = "result";
    isLoud = true;
    expecting : string;
    constructor(private inner : AnyParserAction, private result : any) {
        super();
        this.expecting = inner.expecting;
    }

    _apply(ps : ParsingState) {
        let {inner, result} = this;
        inner.apply(ps);
        if (!ps.isOk) {
            return;
        }
        ps.value = result;
    }
}