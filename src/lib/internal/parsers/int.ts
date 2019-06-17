/**
 * @module parjs/internal/implementation/parsers
 */
/** */

import {Parselets} from "./parselets";
import {ParsingState} from "../state";
import {ResultKind} from "../result";
import {ParserDefinitionError} from "../../errors";
import {ParjserBase} from "../parser";
import {Parjser} from "../../parjser";
import defaults from "lodash/defaults";

/**
 * A set of options for parsing integers.
 */
export interface IntOptions {
    allowSign: boolean;
    base: number;
}

const defaultOptions: IntOptions = {
    allowSign: true,
    base: 10
};

/**
 * Returns a parser that will parse a single integer, with the options
 * given by `options`.
 * @param options A set of options for parsing integers.
 */
export function int(options ?: Partial<IntOptions>): Parjser<number> {
    options = defaults(options, defaultOptions);
    if (options.base > 36) {
        throw new ParserDefinitionError("int", "invalid base");
    }
    let expecting = `a ${options.allowSign ? "signed" : "unsigned"} integer in base ${options.base}`;
    return new class Int extends ParjserBase {
        type = "int";
        displayName = "int";
        expecting = expecting;

        _apply(ps: ParsingState): void {
            let {allowSign, base} = options;
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
                ps.kind = parsedSign ? ResultKind.HardFail : ResultKind.SoftFail;
            } else {
                ps.value = value;
                ps.kind = ResultKind.Ok;
            }
        }

    }();
}
