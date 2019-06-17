/**
 * @module parjs/internal/implementation/parsers
 */
/** */

import {ParsingState} from "../state";
import {ResultKind} from "../result";
import {Parjser} from "../../parjser";
import {ParjserBase} from "../parser";

/**
 * Returns a parser that consumes all the rest of the input and yields the
 * text that was parsed. Always succeeds.
 */
export function rest(): Parjser<string> {
    return new class Rest extends ParjserBase {
        expecting = "zero or more characters";
        type = "rest";
        _apply(pr: ParsingState) {
            let {position, input} = pr;
            let text = input.substr(Math.min(position, input.length));
            pr.position = input.length;
            pr.value = text;
            pr.kind = ResultKind.Ok;
        }
    }();
}
