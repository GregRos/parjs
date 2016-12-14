import {ParjsAction} from "../../../base/action";
import {Chars, Codes} from "../../../functions/char-indicators";
import {Parselets} from './parselets';
import {FastMath} from "../../../functions/math";
import {ParsingState} from "../../../abstract/basics/state";
import {ResultKind} from "../../../abstract/basics/result";
/**
 * Created by User on 28-Nov-16.
 */

/*
    Legal decimal integer format:
    (-|+)\d+
 */

export interface IntOptions {
    allowSign ?: boolean;
    base ?: number;
}

export class PrsInt extends ParjsAction {
    displayName = "int";
    isLoud = true;
    expecting : string;
    constructor(private options : IntOptions) {
        super();
        if (options.base > 36) {
            throw new Error("invalid base");
        }
        this.expecting = `a ${options.allowSign ? "signed" : "unsigned"} integer in base ${options.base}`;
    }
    _apply(ps : ParsingState) {
        let {options : {allowSign, base}} = this;
        let {position, input} = ps;
        let sign = Parselets.parseSign(ps);
        let parsedSign = false;
        if (sign !== 0) {
            parsedSign = true;
        } else {
            sign = 1;
        }
        let value = Parselets.parseDigits(ps, base, FastMath.PositiveExponents[base]);
        if (ps.position === position) {
            ps.kind = parsedSign ? ResultKind.HardFail : ResultKind.SoftFail;
        } else {
            ps.value = value;
            ps.kind = ResultKind.OK;
        }
    }
}