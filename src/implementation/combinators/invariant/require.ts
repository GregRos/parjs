import {JaseParserAction} from "../../../base/parser-action";
import {Issues} from "../../common";
/**
 * Created by User on 21-Nov-16.
 */
export class PrsMust extends JaseParserAction {
    displayName = "must";
    isLoud = true;
    constructor(private inner : AnyParserAction, private requirement : (result : any) => boolean, private failType : ResultKind) {
        super();
        inner.isLoud || Issues.quietParserNotPermitted(this);
    }

    _apply(ps : ParsingState) {
        let {inner, requirement, failType} = this;
        inner.apply(ps);
        if (!ps.result.isOk) {
            return;
        }
        ps.result = requirement(ps.value) ? ResultKind.OK : failType;
    }
}