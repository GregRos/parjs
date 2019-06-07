/**
 * @module parjs/internal/implementation/combinators
 */
/** */

import {ParsingState} from "../state";
import {ReplyKind} from "../../../reply";
import {ParjsCombinator} from "../../../";
import {LoudParser} from "../../../loud";
import {rawCombinator} from "./combinator";
import {BaseParjsParser} from "../parser";

/**
 * Exact iteration combinator. Applies `P` exactly `count` times and yields the results in an array.
 * @param count The number of times to apply `P`.
 */
export function exactly<T>(count: number)
    : ParjsCombinator<LoudParser<T>, LoudParser<T[]>>;

export function exactly(count: number) {
    return rawCombinator(source => {
        return new class Exactly extends BaseParjsParser {
            displayName = "exactly";
            expecting = source.expecting;
            protected _apply(ps: ParsingState): void {
                let arr = [];
                for (let i = 0; i < count; i++) {
                    source.apply(ps);
                    if (!ps.isOk) {
                        if (ps.kind === ReplyKind.SoftFail && i > 0) {
                            ps.kind = ReplyKind.HardFail;
                        }
                        //fail because the inner parser has failed.
                        return;
                    }
                    arr.push(ps.value);
                }
                ps.value = arr;
            }
        }();
    });
}
