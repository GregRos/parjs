/**
 * @module parjs/combinators
 */
/** */

import { ParjsCombinator } from "../../index";
import { ParjserBase } from "../parser";
import { ResultKind } from "../result";
import { ParsingState } from "../state";
import { defineCombinator } from "./combinator";

/**
 * Applies the source parser. If it fails softly, succeeds and yields `val`.
 * @param val
 */
export function maybe<const T, const S = T | undefined>(val?: S): ParjsCombinator<T, T | S> {
    return defineCombinator<T, S>(inner => {
        return new (class MaybeCombinator extends ParjserBase<S> {
            _inner = inner;
            expecting = "expecting anything";
            type = "maybe";
            _apply(ps: ParsingState): void {
                inner.apply(ps);
                if (ps.isSoft) {
                    // on soft failure, set the value and result to OK
                    ps.value = val;
                    ps.kind = ResultKind.Ok;
                }
                // on ok/hard/fatal, propagate the result.
            }
        })();
    });
}
