import type { Parjser } from "../parjser";
import { ParjserBase } from "../parser";
import { ResultKind } from "../result";
import type { ParsingState } from "../state";

class Eof<T> extends ParjserBase<T> {
    type = "eof";
    expecting = "expecting end of input";
    constructor(private result?: T) {
        super();
    }
    _apply(ps: ParsingState): void {
        if (ps.position === ps.input.length) {
            ps.kind = ResultKind.Ok;
            ps.value = this.result;
        } else {
            ps.kind = ResultKind.SoftFail;
        }
    }
}

/**
 * Returns a parser that succeeds if there is no more input.
 *
 * @param result Optionally, the result the parser will yield. Defaults to undefined.
 */
export function eof<T = undefined>(result?: T): Parjser<T> {
    return new Eof(result);
}
