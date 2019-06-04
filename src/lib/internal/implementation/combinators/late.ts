/**
 * @module parjs/internal/implementation/combinators
 */
/** */
import {ParjsAction} from "../../action";
import {AnyParserAction} from "../../../action";
import {ParsingState} from "../../state";
import {AnyParser} from "../../../../any";
import {BaseParjsParser} from "../../parser";

export function late<T extends AnyParser>(resolver: () => T, isLoud: boolean) {
    return new class Late extends BaseParjsParser {
        displayName = "late";
        expecting = "late (unbound)"
        isLoud = isLoud;
        _resolved: BaseParjsParser;

       _apply(ps: ParsingState): void {
            if (this._resolved) {
                this._resolved.apply(ps);
                return;
            }
            this._resolved = resolver() as any as BaseParjsParser;
            this.expecting = this._resolved.expecting;
        }
    }();
}
