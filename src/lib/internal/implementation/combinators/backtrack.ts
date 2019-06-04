/**
 * @module parjs/internal/implementation/combinators
 */
/** */
import {ParjsAction} from "../../action";
import {ParsingState} from "../../state";
import {AnyParserAction} from "../../../action";
import {ParjsCombinator} from "../../../../loud-combinators";
import {LoudParser} from "../../../../loud";
import {QuietParser} from "../../../../quiet";
import {BaseParjsParser} from "../../parser";
import {rawCombinator} from "../combinator";
import {AnyParser} from "../../../../any";

export function backtrack<T extends AnyParser>(): ParjsCombinator<T, T> {
    return rawCombinator(source => {
        return new class Backtrack extends BaseParjsParser {
            displayName = "backtrack";
            expecting = source.expecting;
            isLoud = source.isLoud;

            _apply(ps: ParsingState): void {
                let {position} = ps;
                source.apply(ps);
                if (ps.isOk) {
                    //if inner succeeded, we backtrack.
                    ps.position = position;
                }
                //whatever code ps had, we return it.
            }

        }();
    });
}
