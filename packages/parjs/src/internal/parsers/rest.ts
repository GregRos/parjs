import type { Parjser } from "../parjser";
import { ParjserBase } from "../parser";
import { ResultKind } from "../result";
import type { ParsingState } from "../state";

class Rest extends ParjserBase<string> {
    type = "rest";
    expecting = "expecting anything";

    _apply(pr: ParsingState) {
        const { position, input } = pr;
        const text = input.substring(Math.min(position, input.length));
        pr.position = input.length;
        pr.value = text;
        pr.kind = ResultKind.Ok;
    }
}

/**
 * Returns a parser that consumes all the rest of the input and yields the text that was parsed.
 * Always succeeds.
 */
export function rest(): Parjser<string> {
    return new Rest();
}
