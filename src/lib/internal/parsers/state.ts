/**
 * @module parjs/internal/implementation/parsers
 */
/** */

import {ParsingState} from "../state";
import {ResultKind} from "../reply";

import {Parjser} from "../../parjser";
import {ParjserBase} from "../parser";

/**
 * Returns a parser that yields the current user state object. It always succeeds.
 */
export function state(): Parjser<any> {
    return new class State extends ParjserBase {
        type = "state";
        expecting = "anything";

        _apply(ps: ParsingState): void {
            ps.value = ps.userState;
            ps.kind = ResultKind.Ok;
        }

    }();
}
