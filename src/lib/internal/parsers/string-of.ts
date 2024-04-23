import type { Parjser } from "../parjser";
import { ParjserBase } from "../parser";
import { ResultKind } from "../result";
import type { ParsingState } from "../state";

class StringOf<T> extends ParjserBase<T> {
    type = "anyStringOf";
    expecting = `expecting any of ${this.strs.map(x => `'${x}'`).join(", ")}`;

    constructor(private strs: string[]) {
        super();
    }

    _apply(ps: ParsingState) {
        const { position, input } = ps;
        const { strs } = this;
        // eslint-disable-next-line @typescript-eslint/prefer-for-of
        for (let i = 0; i < strs.length; i++) {
            const curStr = strs[i];
            if (input.length - position < curStr.length) continue;
            const curSubstr = input.slice(position, position + curStr.length);
            if (curSubstr === curStr) {
                // this means we did not contiue strLoop so curStr passed our tests
                ps.position = position + curStr.length;
                ps.value = curStr;
                ps.kind = ResultKind.Ok;
                return;
            }
        }
        ps.kind = ResultKind.SoftFail;
    }
}

/**
 * Returns a parser that will parse any of the strings in `strs` and yield the text that was parsed.
 * If it can't, it will fail softly without consuming input.
 *
 * @param strs A set of string options to parse. In typescript, you can also use a constant tuple if
 *   you pass it in using the spread operator (`...`).
 */
export function anyStringOf<T extends string>(...strs: T[]): Parjser<T> {
    return new StringOf(strs);
}
