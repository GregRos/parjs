/**
 * @module parjs/combinators
 */
/** */

import {ParsingState} from "../state";

import {ParjserBase} from "../parser";
import {Parjser} from "../parjser";

/**
 * Returns a parser that, when it is first applied, will call `resolver`
 * and behave like the parser returned by that function.
 * @param resolver The function that resolves the parser to use.
 */
export function late<T>(resolver: () => Parjser<T>): Parjser<T> {
    return new class Late extends ParjserBase {
        type = "late";
        get expecting() {
            return !this._resolved ? "late (unbound)" : this._resolved.expecting;
        }
        _resolved: ParjserBase;

       _apply(ps: ParsingState): void {
            if (this._resolved) {
                this._resolved.apply(ps);
                return;
            }
            this._resolved = resolver() as any as ParjserBase;
            this._resolved.apply(ps);
        }
    }();
}
