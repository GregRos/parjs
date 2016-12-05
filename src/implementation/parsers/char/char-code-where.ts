import {JaseBaseParserAction} from "../../../base/parser-action";
/**
 * Created by User on 24-Nov-16.
 */
export class PrsCharCodeWhere extends JaseBaseParserAction {
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
            ps.result = ResultKind.SoftFail;
            return;
        };
        let curChar = input.charCodeAt(position);
        if (!predicate(curChar)) {
            ps.result = ResultKind.SoftFail;
            return;
        }
        ps.value = String.fromCharCode(curChar);
        ps.position++;
        ps.result = ResultKind.OK;
    }
}