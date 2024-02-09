import { ResultKind } from "../result";
import type { ParsingState } from "../state";
import type { Parjser } from "../parjser";
import { ParjserBase } from "../parser";

class Result<T> extends ParjserBase<T> {
    expecting = "expecting anything";
    type = "result";
    constructor(private value: T) {
        super();
    }

    _apply(ps: ParsingState): void {
        ps.value = this.value;
        ps.kind = ResultKind.Ok;
    }
}

/**
 * Returns a parser that succeeds without consuming input and yields the
 * constant `value`.
 * @param value The value the returned parser will yield.
 */
export function result<T>(value: T): Parjser<T> {
    return new Result(value);
}
