import {JaseParserAction, JaseBaseParserAction} from "../../../base/parser-action";
/**
 * Created by User on 21-Nov-16.
 */
export class PrsCharWhere extends JaseBaseParserAction {
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
            ps.result = ResultKind.SoftFail;
            return;
        }
        let curChar = input[position];
        if (!predicate(curChar)) {
            ps.result =  ResultKind.SoftFail;
            return;
        }
        ps.value = curChar;
        ps.position++;
        ps.result = ResultKind.OK;
    }
}
