/**
 * @module parjs/internal/implementation/combinators
 */
/** */

import {ParsingState} from "../state";

import {ParjserBase} from "../parser";
import {Parjser} from "../../parjser";

/**
 * Returns a parser that, when it is first applied, will call `resolver`
 * and behave like the parser returned by that function.
 * @param resolver
 */
export function late<T>(resolver: () => Parjser<T>): Parjser<T> {
    return new class Late extends ParjserBase {
        type = "late";
        expecting = "late (unbound)";
        _resolved: ParjserBase;

       _apply(ps: ParsingState): void {
            if (this._resolved) {
                this._resolved.apply(ps);
                return;
            }
            this._resolved = resolver() as any as ParjserBase;
            this._resolved.apply(ps);
            this.expecting = this._resolved.expecting;
        }
    }();
}
