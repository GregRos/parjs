/**
 * @module parjs/internal/implementation/parsers
 */
/** */

import {ParsingState} from "../state";
import {ResultKind} from "../result";
import {ParjserBase} from "../parser";
import {Parjser} from "../../parjser";

/**
 * Returns a parser that succeeds if there is no more input.
 * @param result Optionally, the result the parser will yield. Defaults to
 * undefined.
 */
export function eof<T>(result?: T): Parjser<T> {
    return new class Eof extends ParjserBase {
        type = "eof";
        expecting = "end of input";

        _apply(ps: ParsingState): void {
            if (ps.position === ps.input.length) {
                ps.kind = ResultKind.Ok;
                ps.value = result;
            } else {
                ps.kind = ResultKind.SoftFail;
            }
        }

    }() as any;
}
