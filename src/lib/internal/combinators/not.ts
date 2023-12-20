/**
 * @module parjs/combinators
 */
/** */

import { ResultKind } from "../result";
import type { ParsingState } from "../state";
import type { ParjsCombinator } from "../../";

import { defineCombinator } from "./combinator";
import { ParjserBase } from "../parser";

/**
 * Applies the source parser. Succeeds if if it fails softly, and fails otherwise.
 */
export function not(): ParjsCombinator<unknown, void> {
    return defineCombinator<unknown, void>(source => {
        return new (class Not extends ParjserBase<void> {
            type = "not";
            expecting = `not expecting: ${source.expecting}`; // TODO: better reason
            _apply(ps: ParsingState): void {
                const { position } = ps;
                source.apply(ps);
                if (ps.isOk) {
                    ps.position = position;
                    ps.kind = ResultKind.SoftFail;
                } else if (ps.kind === ResultKind.HardFail || ps.kind === ResultKind.SoftFail) {
                    // hard fails are okay here
                    ps.kind = ResultKind.Ok;
                    ps.position = position;
                    return;
                }
                // the remaining case is a fatal failure that isn't recovered from.
            }
        })();
    });
}
