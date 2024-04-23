/** Copyright © 2024, Oracle and/or its affiliates. */
/** @module parjs */

import type { Parjser } from "..";
import { ParjserBase } from "../parser";
import { ResultKind } from "../result";
import type { ParsingState } from "../state";

class CaseInsensitiveString extends ParjserBase<string> {
    expecting = `expecting '${this.str}' (case insensitive)`;
    type = "string";
    constructor(private str: string) {
        super();
    }

    _apply(ps: ParsingState): void {
        const { position, input } = ps;
        const { str } = this;
        if (position + str.length > input.length) {
            ps.kind = ResultKind.SoftFail;
            return;
        }
        // This should create a StringSlice object instead of actually
        // copying a whole string.
        const substr = input.slice(position, position + str.length);

        // Equality test is very very fast.
        if (substr.toLowerCase() !== str.toLowerCase()) {
            ps.kind = ResultKind.SoftFail;
            return;
        }
        ps.position += str.length;
        ps.value = substr;
        ps.kind = ResultKind.Ok;
    }
}

/**
 * Returns a parser that will parse the string `str` insensitive to its case and yield the text that
 * was parsed. If it can't, it will fail softly without consuming input.
 *
 * @param str The string to parse case insensitively.
 */
export function caseString(str: string): Parjser<string> {
    return new CaseInsensitiveString(str);
}
