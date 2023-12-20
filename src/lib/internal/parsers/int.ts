/**
 * @module parjs
 */
/** */

import { NumericHelpers } from "./numeric-helpers";
import type { ParsingState } from "../state";
import { ResultKind } from "../result";
import { ParserDefinitionError } from "../../errors";
import { ParjserBase } from "../parser";
import type { Parjser } from "../parjser";
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
 * @param pOptions A set of options for parsing integers.
 */
export function int(pOptions?: Partial<IntOptions>): Parjser<number> {
    const options = defaults(pOptions, defaultOptions);
    if (options.base > 36) {
        throw new ParserDefinitionError("int", "invalid base");
    }
    const expecting = `expecting a ${options.allowSign ? "signed" : "unsigned"} integer in base ${
        options.base
    }`;
    return new (class Int extends ParjserBase<number> {
        type = "int";
        displayName = "int";
        expecting = expecting;

        _apply(ps: ParsingState): void {
            const { allowSign, base } = options;
            let { position } = ps;
            const { input } = ps;
            const initPos = ps.position;
            let sign = allowSign ? NumericHelpers.parseSign(ps) : 0;
            let parsedSign = false;
            if (sign !== 0) {
                parsedSign = true;
            } else {
                sign = 1;
            }
            position = ps.position;
            NumericHelpers.parseDigitsInBase(ps, base);
            const value = parseInt(input.substring(initPos, ps.position), base);

            if (ps.position === position) {
                ps.kind = parsedSign ? ResultKind.HardFail : ResultKind.SoftFail;
            } else {
                ps.value = value;
                ps.kind = ResultKind.Ok;
            }
        }
    })();
}
