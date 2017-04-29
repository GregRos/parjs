/**
 * @module parjs/internal/implementation/parsers
 */ /** */

import {ParjsBasicAction} from "../../action";
import {ReplyKind} from "../../../../reply";
import {ParsingState} from "../../state";
/**
 * Created by User on 24-Nov-16.
 */
export class PrsCharCodeWhere extends ParjsBasicAction {

    isLoud = true;
    expecting : string;
    constructor(private predicate : (char : number) => boolean, property = "(a specific property)") {
        super();
        this.expecting = `any character satisfying ${property}.`;
    }

    _apply(ps : ParsingState) {
        let {predicate} = this;
        let {position, input} = ps;
        if (position >= input.length) {
            ps.kind = ReplyKind.SoftFail;
            return;
        }
        let curChar = input.charCodeAt(position);
        if (!predicate(curChar)) {
            ps.kind = ReplyKind.SoftFail;
            return;
        }
        ps.value = String.fromCharCode(curChar);
        ps.position++;
        ps.kind = ReplyKind.OK;
    }
}