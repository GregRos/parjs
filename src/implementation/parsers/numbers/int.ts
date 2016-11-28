import {JaseParserAction} from "../../../base/parser-action";
import {Chars, Codes} from "../../../functions/char-indicators";
/**
 * Created by User on 28-Nov-16.
 */

/*
    Legal decimal integer format:
    (-|+)\d+
 */

export class PrsInt extends JaseParserAction {
    displayName = "int";
    isLoud = true;
    constructor(private signed : boolean, private base : number) {
        super();
        if (base > 36) {
            throw new Error("invalid base");
        }
    }
    _apply(ps : ParsingState) {
        let {signed, base} = this;
        let {position, input} = ps;
        let sign = 1;
        let maybeSign = input.charCodeAt(position);
        if (signed) {
            if (maybeSign === Codes.minus) {
                sign = -1;
                position++;
            } else if (maybeSign === Codes.plus) {
                position++;
            }
        }
        let num = 0;
        let factor = sign;
        for (; position < input.length; position++,factor *= 10) {
            let curCode = input.charCodeAt(position);
            if (Codes.isDigit(curCode, base)) {
                let value = Codes.digitValue(curCode);
                num += value * factor;
            } else {
                break;
            }
        }
        if (factor <= 1) {
            //this means the loop 'broke' on the first character.
            return false;
        }
        ps.position = position;
        ps.result = num;
        return true;
    }
}