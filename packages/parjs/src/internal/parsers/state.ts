import { ResultKind } from "../result";
import type { ParsingState } from "../state";

import type { Parjser } from "../parjser";
import { ParjserBase } from "../parser";

class State<T> extends ParjserBase<T> {
    type = "state";
    expecting = "expecting anything";

    _apply(ps: ParsingState): void {
        ps.value = ps.userState;
        ps.kind = ResultKind.Ok;
    }
}

/** Returns a parser that yields the current user state object. It always succeeds. */
export function state<T>(): Parjser<T> {
    return new State();
}
