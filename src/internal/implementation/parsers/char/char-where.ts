/**
 * @module parjs/internal/implementation/parsers
 */ /** */
import {ParjsAction, ParjsBasicAction} from "../../action";
import {ParsingState} from "../../state";
import {ReplyKind} from "../../../../reply";
/**
 * Created by User on 21-Nov-16.
 */
export class PrsCharWhere extends ParjsBasicAction {

    isLoud = true;
    expecting : string;
    constructor(private predicate : (char : string) => boolean, expecting : string = "(some property)") {
        super();
        this.expecting = `a char matching: ${expecting}`;
    }

    _apply(ps : ParsingState) {
        let {predicate} = this;
        let {position, input} = ps;
        if (position >= input.length) {
            ps.kind = ReplyKind.SoftFail;
            return;
        }
        let curChar = input[position];
        if (!predicate(curChar)) {
            ps.kind =  ReplyKind.SoftFail;
            return;
        }
        ps.value = curChar;
        ps.position++;
        ps.kind = ReplyKind.OK;
    }
}
