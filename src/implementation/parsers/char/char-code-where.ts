import {JaseBaseParserAction} from "../../../base/parser-action";
/**
 * Created by User on 24-Nov-16.
 */
export class PrsCharCodeWhere extends JaseBaseParserAction {
    displayName ="charCodeWhere";
    isLoud = true;
    constructor(private predicate : (char : number) => boolean) {
        super();
    }

    _apply(ps : ParsingState) {
        let {predicate} = this;
        let {position, input} = ps;
        if (position >= input.length) return false;
        let curChar = input.charCodeAt(position);
        if (!predicate(curChar)) {
            return false;
        }
        ps.result = String.fromCharCode(curChar);
        ps.position++;
        return true;
    }
}