import type { CombinatorInput } from "../combinated";
import { Combinated } from "../combinated";
import type { ParjsCombinator } from "../parjser";
import type { FailureInfo } from "../result";
import type { ParsingState } from "../state";
import type { ImplicitParjser } from "../wrap-implicit";
import { wrapImplicit } from "../wrap-implicit";

class Expects<T> extends Combinated<T, T> {
    type = "expects";

    expecting = typeof this.messageOrFunction === "string" ? this.messageOrFunction : "<dynamic>";
    constructor(
        source: CombinatorInput<T>,
        private readonly messageOrFunction: string | ((failure: FailureInfo) => string)
    ) {
        super(source);
    }
    _apply(ps: ParsingState): void {
        const { position } = ps;
        const { messageOrFunction } = this;
        this.source.apply(ps);
        if (ps.kind !== "OK") {
            ps.reason =
                typeof messageOrFunction === "string"
                    ? messageOrFunction
                    : messageOrFunction({
                          kind: ps.kind,
                          reason: ps.reason! // the error is guaranteed to be non-null
                      });
            return;
        }
        ps.position = position;
    }
}

/**
 * Applies the source parser, modifying the failure reason to the given message if it fails Softly.
 * Useful for providing the user with a more meaningful error message than was is provided by
 * default.
 *
 * @param message The new message.
 */
export function reason<T>(message: string): ParjsCombinator<T, T>;
/**
 * Applies the source parser. If it fails, calls `onFailure` with the failure info and uses the
 * returned string as the new failure reason.
 *
 * @param onFailure A function that takes the failure info and returns the new reason.
 */
export function reason<T>(onFailure: (failure: FailureInfo) => string): ParjsCombinator<T, T>;
export function reason<T>(messageOrFunction: string | ((failure: FailureInfo) => string)) {
    return (source: ImplicitParjser<T>) => new Expects(wrapImplicit(source), messageOrFunction);
}
