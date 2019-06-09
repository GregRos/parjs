/**
 * @module parjs/internal/implementation/combinators
 */
/** */

import {ResultKind} from "../../reply";
import {ParsingState} from "../state";

import {ParjsCombinator} from "../../index";
import {defineCombinator} from "./combinator";
import {ParjserBase} from "../parser";

/**
 * Applies the source parser and makes sure it captured some input.
 * @param failType
 */
export function mustCapture<T>(failType: ResultKind = ResultKind.HardFail): ParjsCombinator<T, T> {
    return defineCombinator(source => {
        return new class MustCapture extends ParjserBase {
            expecting = `internal parser ${source.type} to consume input`;
            type = "mustCapture";
            _apply(ps: ParsingState) {
                let {position} = ps;
                source.apply(ps);
                if (!ps.isOk) {
                    return;
                }
                ps.kind = position !== ps.position ? ResultKind.Ok : failType;
            }
        }();
    });
}
