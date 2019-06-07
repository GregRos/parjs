/**
 * @module parjs/internal/implementation/combinators
 */
/** */

import {ParsingState} from "../state";
import {StringHelpers} from "../functions/helpers";
import {ParjsCombinator} from "../../../";

import {LoudParser} from "../../../loud";
import {defineCombinator} from "./combinator";
import {BaseParjsParser} from "../parser";

/**
 * Applies the source parser and yields a stringified result.
 */
export function str(): ParjsCombinator<any, string> {
    return defineCombinator(source => {
        return new class Str extends BaseParjsParser {
            displayName = "str";
            expecting = source.expecting;
            protected _apply(ps: ParsingState): void {
                source.apply(ps);
                if (!ps.isOk) {
                    return;
                }
                let {value} = ps;
                let typeStr = typeof value;
                if (typeStr === "string") {

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
