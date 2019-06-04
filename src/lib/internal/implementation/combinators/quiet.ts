/**
 * @module parjs/internal/implementation/combinators
 */
/** */
import {ParjsAction} from "../../action";
import {AnyParserAction} from "../../../action";
import {ParsingState} from "../../state";
import {ParjsCombinator} from "../../../../loud-combinators";
import {AnyParser} from "../../../../any";
import {QuietParser} from "../../../../quiet";
import {rawCombinator} from "../combinator";
import {BaseParjsParser} from "../../parser";
import {QUIET_RESULT} from "../../special-results";

export function q(): ParjsCombinator<AnyParser, QuietParser> {
    return rawCombinator(source => {
        return new class Q extends BaseParjsParser {
            displayName = "q";
            expecting = source.expecting;
            isLoud = false;
            protected _apply(ps: ParsingState): void {
                source.apply(ps);
                ps.value = QUIET_RESULT;
            }
        }();
    });
}
