/**
 * @module parjs/internal/implementation/combinators
 */ /** */
import {ParjsAction} from "../../action";
import {Issues} from "../../issues";
import {ParsingState} from "../../state";
import {ReplyKind} from "../../../../reply";
import {AnyParserAction} from "../../../action";
/**
 * Created by User on 21-Nov-16.
 */
export class PrsMust extends ParjsAction {
    isLoud : boolean;
    expecting : string;
    constructor(
        private inner : AnyParserAction,
        private requirement : (result : any, state : any) => boolean,
        private failType,
        private qualityName
    ) {
        super();
        this.isLoud = inner.isLoud;
        this.expecting = `intenral parser ${inner.displayName} yielding a result satisfying ${qualityName}`;
    }

    _apply(ps : ParsingState) {
        let {inner, requirement, failType} = this;
        inner.apply(ps);
        if (!ps.isOk) {
            return;
        }
        ps.kind = requirement(ps.value, ps.userState) ? ReplyKind.OK : failType;
    }
}