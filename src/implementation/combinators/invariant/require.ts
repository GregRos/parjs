import {ParjsParserAction, ResultsClass} from "../../../base/action";
import {Issues} from "../../common";
/**
 * Created by User on 21-Nov-16.
 */
export class PrsMust extends ParjsParserAction {
    displayName = "must";
    isLoud = true;
    expecting : string;
    constructor(
        private inner : AnyParserAction,
        private requirement : (result : any) => boolean,
        private failType,
        private qualityName
    ) {
        super();
        inner.isLoud || Issues.quietParserNotPermitted(this);
        this.expecting = `intenral parser ${inner.displayName} yielding a result satisfying ${qualityName}`;
    }

    _apply(ps : ParsingState) {
        let {inner, requirement, failType} = this;
        inner.apply(ps);
        if (!ps.isOk) {
            return;
        }
        ps.result = requirement(ps.value) ? ResultKind.OK : failType;
    }
}