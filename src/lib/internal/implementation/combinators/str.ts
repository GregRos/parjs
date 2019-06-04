/**
 * @module parjs/internal/implementation/combinators
 */
/** */
import {QUIET_RESULT} from "../../special-results";
import {ParjsAction} from "../../action";
import {AnyParserAction} from "../../../action";
import {ParsingState} from "../../state";
import {StringHelpers} from "../../functions/helpers";
import {ParjsCombinator} from "../../../../loud-combinators";
import {AnyParser} from "../../../../any";
import {LoudParser} from "../../../../loud";
import {rawCombinator} from "../combinator";
import {BaseParjsParser} from "../../parser";

export function str(): ParjsCombinator<AnyParser, LoudParser<string>> {
    return rawCombinator(source => {
        return new class Str extends BaseParjsParser {
            displayName = "str";
            expecting = source.expecting;
            isLoud = true;
            protected _apply(ps: ParsingState): void {
                source.apply(ps);
                if (!ps.isOk) {
                    return;
                }
                let {value} = ps;
                let typeStr = typeof value;
                if (typeStr === "string") {

                } else if (value === QUIET_RESULT) {
                    ps.value = "";
                } else if (value === null || value === undefined) {
                    ps.value = String(value);
                } else if (value instanceof Array) {
                    ps.value = StringHelpers.recJoin(value);
                } else if (typeStr === "symbol") {
                    ps.value = String(value).slice(7, -1);
                } else {
                    ps.value = value.toString();
                }
            }

        }();
    });
}
