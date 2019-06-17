/**
 * @module parjs
 */
/** */

import {ResultKind} from "../result";
import {ParsingState} from "../state";
import {Parjser} from "../parjser";
import {ParjserBase} from "../parser";

/**
 * Returns a parser that succeeds without consuming input and yields the
 * constant `value`.
 * @param value The value the returned parser will yield.
 */
export function result<T>(value: T): Parjser<T> {
    return new class Result extends ParjserBase {
        expecting = "anything";
        type = "result";
        _apply(ps: ParsingState): void {
            ps.value = value;
            ps.kind = ResultKind.Ok;
        }

    }();
}
