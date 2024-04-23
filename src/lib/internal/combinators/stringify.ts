import { Combinated } from "../combinated";
import { recJoin } from "../functions";
import type { ParjsCombinator } from "../parjser";
import type { ParsingState } from "../state";
import { wrapImplicit } from "../wrap-implicit";

class Str extends Combinated<unknown, string> {
    type = "stringify";
    expecting = this.source.expecting;

    _apply(ps: ParsingState): void {
        this.source.apply(ps);
        if (!ps.isOk) {
            return;
        }
        const { value } = ps;
        const typeStr = typeof value;
        if (typeStr === "string") {
            return;
        }
        if (value === null || value === undefined) {
            ps.value = String(value);
        } else if (value instanceof Array) {
            ps.value = recJoin(value);
        } else if (typeStr === "symbol") {
            ps.value = String(value).slice(7, -1);
        } else {
            ps.value = value.toString();
        }
    }
}

/** Applies the source parser and yields a stringified result. */
export function stringify(): ParjsCombinator<unknown, string> {
    return source => new Str(wrapImplicit(source));
}
