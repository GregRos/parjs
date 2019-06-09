/**
 * @module parjs/internal/implementation/combinators
 */
/** */

import {Issues} from "../issues";
import {ParsingState} from "../state";
import {ResultKind} from "../reply";
import {ImplicitLoudParser, ParjsCombinator} from "../../index";
import {defineCombinator} from "./combinator";
import {ParjserBase} from "../parser";
import {LiteralConverter} from "../literal-conversion";

/**
 * Tries to apply the source parser repeatedly until `till` succeeds. Yields
 * the results of the source parser in an array.
 * @param till The parser that indicates iteration should stop.
 * @param tillOptional If true, parsing will succeed if the source parser
 * fails softly. Defaults to false.
 */
export function manyTill<T>(till: ImplicitLoudParser<any>, tillOptional?: boolean)
    : ParjsCombinator<T, T[]>;
export function manyTill(till: ImplicitLoudParser<any>, tillOptional?: boolean) {
    let tillResolved = LiteralConverter.convert(till) as any as ParjserBase;
    return defineCombinator(source => {
        return new class ManyTill extends ParjserBase {
            type = "manyTill";
            expecting = `${source.expecting} or ${tillResolved.expecting}`;

            _apply(ps: ParsingState): void {
                let {position} = ps;
                let arr = [];
                let successes = 0;
                while (true) {
                    tillResolved.apply(ps);
                    if (ps.isOk) {
                        break;
                    } else if (ps.atLeast(ResultKind.HardFail)) {
                        //if till failed hard/fatally, we return the fail result.
                        return;
                    }
                    //backtrack to before till failed.
                    ps.position = position;
                    source.apply(ps);
                    if (ps.isOk) {
                        arr.push(ps.value);
                    } else if (ps.isSoft) {
                        //many failed softly before till...
                        if (!tillOptional) {
                            //if we parsed at least one element, we fail hard.
                            ps.kind = successes === 0 ? ResultKind.SoftFail : ResultKind.HardFail;
                            return;
                        } else {
                            //till was optional, so many failing softly is OK.
                            break;
                        }
                    } else {
                        //many failed hard/fatal
                        return;
                    }
                    if (ps.position === position) {
                        Issues.guardAgainstInfiniteLoop("manyTill");
                    }
                    position = ps.position;
                    successes++;
                }
                ps.value = arr;
                ps.kind = ResultKind.Ok;
            }

        }();
    });
}
