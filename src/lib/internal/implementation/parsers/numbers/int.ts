/**
 * @module parjs/internal/implementation/parsers
 */ /** */
import {ParjsAction} from "../../action";
import {Parselets} from "./parselets";
import {ParsingState} from "../../state";
import {ReplyKind} from "../../../../reply";
import {ParserDefinitionError} from "../../../../errors";
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

    isLoud = true;
    expecting : string;
    constructor(private _options : IntOptions) {
        super();
        if (_options.base > 36) {
            throw new ParserDefinitionError("int", "invalid base");
        }
        this.expecting = `a ${_options.allowSign ? "signed" : "unsigned"} integer in base ${_options.base}`;
    }
    _apply(ps : ParsingState) {
        let {_options : {allowSign, base}} = this;
        let {position, input} = ps;
        let initPos = ps.position;
        let sign = allowSign ? Parselets.parseSign(ps) : 0;
        let parsedSign = false;
        if (sign !== 0) {
            parsedSign = true;
        } else {
            sign = 1;
        }
        position = ps.position;
        Parselets.parseDigitsInBase(ps, base);
        let value = parseInt(input.substring(initPos, ps.position), base);

        if (ps.position === position) {
            ps.kind = parsedSign ? ReplyKind.HardFail : ReplyKind.SoftFail;
        } else {
            ps.value = value;
            ps.kind = ReplyKind.Ok;
        }

    }
}