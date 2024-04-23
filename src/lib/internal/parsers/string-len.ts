import type { Parjser } from "../..";
import { ParjserBase } from "../parser";
import { ResultKind } from "../result";
import type { ParsingState } from "../state";

class StringLen extends ParjserBase<string> {
    type = "stringLen";
    expecting = `expecting ${this.length} characters`;

    constructor(private length: number) {
        super();
    }

    _apply(ps: ParsingState) {
        const { position, input } = ps;
        const length = this.length;
        if (input.length < position + length) {
            ps.kind = ResultKind.SoftFail;
            return;
        }
        ps.position += length;
        ps.value = input.substring(position, position + length);
        ps.kind = ResultKind.Ok;
    }
}

/**
 * Returns a parser that parses exactly `length` characters and yields the text that was parsed.
 *
 * @param length The number of characters to parse.
 */
export function stringLen(length: number): Parjser<string> {
    return new StringLen(length);
}
