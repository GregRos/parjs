/**
 * @module parjs
 */
/** */

import type { ParsingState } from "../state";
import { ResultKind } from "../result";

import type { Parjser } from "../parjser";
import { ParjserBase } from "../parser";

/**
 * Returns a parser that yields the current user state object. It always succeeds.
 */
export function state<T>(): Parjser<T> {
    return new (class State extends ParjserBase<T> {
        type = "state";
        expecting = "expecting anything";

        _apply(ps: ParsingState): void {
            ps.value = ps.userState;
            ps.kind = ResultKind.Ok;
        }
    })();
}
