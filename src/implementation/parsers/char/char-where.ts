import {JaseParserAction, JaseBaseParserAction} from "../../../base/parser-action";
/**
 * Created by User on 21-Nov-16.
 */
export class PrsCharWhere extends JaseBaseParserAction {
    displayName ="charWhere";
    isLoud = true;
    constructor(private predicate : (char : string) => boolean) {
        super();
    }

    _apply(ps : ParsingState) {
        let {predicate} = this;
        let {position, input} = ps;
        if (position >= input.length) return false;
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
