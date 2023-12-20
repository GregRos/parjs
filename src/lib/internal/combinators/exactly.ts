/**
 * @module parjs/combinators
 */
/** */

import type { ParsingState } from "../state";
import { ResultKind } from "../result";
import type { ParjsCombinator } from "../../index";
import { defineCombinator } from "./combinator";
import { ParjserBase } from "../parser";

/**
 * Applies the source parser exactly `count` times, and yields all the results in an array.
 * @param count The number of times to apply the source parser.
 */
export function exactly<T>(count: number): ParjsCombinator<T, T[]> {
    return defineCombinator<T, T[]>(source => {
        return new (class Exactly extends ParjserBase<T[]> {
            type = "exactly";
            expecting = source.expecting;
            _apply(ps: ParsingState): void {
                const arr = [] as unknown[];
                for (let i = 0; i < count; i++) {
                    source.apply(ps);
                    if (!ps.isOk) {
                        if (ps.kind === ResultKind.SoftFail && i > 0) {
                            ps.kind = ResultKind.HardFail;
                        }
                        // fail because the inner parser has failed.
                        return;
                    }
                    arr.push(ps.value);
                }
                ps.value = arr;
            }
        })();
    });
}
