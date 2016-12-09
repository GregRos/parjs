import {ParjsBasicAction} from "../../../base/action";
import {ResultKind} from "../../../abstract/basics/result";
import {ParsingState} from "../../../abstract/basics/state";
/**
 * Created by User on 24-Nov-16.
 */
export class PrsCharCodeWhere extends ParjsBasicAction {
    displayName ="charCodeWhere";
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
            ps.kind = ResultKind.SoftFail;
            return;
        };
        let curChar = input.charCodeAt(position);
        if (!predicate(curChar)) {
            ps.kind = ResultKind.SoftFail;
            return;
        }
        ps.value = String.fromCharCode(curChar);
        ps.position++;
        ps.kind = ResultKind.OK;
    }
}