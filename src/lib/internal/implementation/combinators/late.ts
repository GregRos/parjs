/**
 * @module parjs/internal/implementation/combinators
 */
/** */

import {ParsingState} from "../state";

import {BaseParjsParser} from "../parser";
import {LoudParser} from "../../../loud";

export function late<T>(resolver: () => LoudParser<T>): LoudParser<T> {
    return new class Late extends BaseParjsParser {
        displayName = "late";
        expecting = "late (unbound)";
        _resolved: BaseParjsParser;

       _apply(ps: ParsingState): void {
            if (this._resolved) {
                this._resolved.apply(ps);
                return;
            }
            this._resolved = resolver() as any as BaseParjsParser;
            this._resolved.apply(ps);
            this.expecting = this._resolved.expecting;
        }
    }();
}
