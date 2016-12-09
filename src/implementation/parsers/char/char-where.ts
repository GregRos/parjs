import {ParjsAction, ParjsBasicAction} from "../../../base/action";
import {ParsingState} from "../../../abstract/basics/state";
import {ResultKind} from "../../../abstract/basics/result";
/**
 * Created by User on 21-Nov-16.
 */
export class PrsCharWhere extends ParjsBasicAction {
    displayName ="charWhere";
    isLoud = true;
    expecting : string;
    constructor(private predicate : (char : string) => boolean, property : string = "(some property)") {
        super();
        this.expecting = `any character satisfying ${property}`;
    }

    _apply(ps : ParsingState) {
        let {predicate} = this;
        let {position, input} = ps;
        if (position >= input.length) {
            ps.kind = ResultKind.SoftFail;
            return;
        }
        let curChar = input[position];
        if (!predicate(curChar)) {
            ps.kind =  ResultKind.SoftFail;
            return;
        }
        ps.value = curChar;
        ps.position++;
        ps.kind = ResultKind.OK;
    }
}
