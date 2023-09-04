/**
 * @module parjs
 */
/** */

import { ParsingState } from "../state";
import { ResultKind } from "../result";
import { Parjser } from "../parjser";
import { ParjserBase } from "../parser";

/**
 * Returns a parser that consumes all the rest of the input and yields the
 * text that was parsed. Always succeeds.
 */
export function rest(): Parjser<string> {
    return new (class Rest extends ParjserBase {
        expecting = "expecting anything";
        type = "rest";
        _apply(pr: ParsingState) {
            const { position, input } = pr;
            const text = input.substr(Math.min(position, input.length));
            pr.position = input.length;
            pr.value = text;
            pr.kind = ResultKind.Ok;
        }
    })();
}
