/**
 * @module parjs/combinators
 */
/** */

import type { ParsingState } from "../state";

import { ParjserBase } from "../parser";
import type { Parjser } from "../parjser";
import { Issues } from "../issues";

/**
 * A parser with logic to be determined later. Useful for defining some kinds
 * of recursive parsers.
 */
export interface DelayedParjser<T> extends Parjser<T> {
    init(resolved: Parjser<T>): void;
}

/**
 * Returns a parser that has no logic by itself and must be initialized with
 * another parser by calling the parser's `init` function.
 */
export function later<T>(): DelayedParjser<T> {
    return new (class Late extends ParjserBase<T> implements DelayedParjser<T> {
        type = "later";
        _resolved!: ParjserBase<T>;
        get expecting() {
            return !this._resolved ? "unbound delayed parser" : this._resolved.expecting;
        }

        init(resolved: Parjser<T>) {
            if (this._resolved) Issues.delayedParserAlreadyInit();
            this._resolved = resolved as ParjserBase<T>;
        }

        _apply(ps: ParsingState): void {
            if (!this._resolved) {
                Issues.delayedParserNotInit("");
            }
            this._resolved.apply(ps);
        }
    })();
}
