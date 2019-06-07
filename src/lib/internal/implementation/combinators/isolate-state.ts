import {LoudParser, ParjsCombinator, UserState} from "../../../index";
import {rawCombinator} from "./combinator";
import {BaseParjsParser} from "../parser";
import {ParsingState} from "../state";
import cloneDeep from "lodash/cloneDeep";

/**
 * State isolation/replacement combinator. Switches the user state with `innerState`,
 * applies `P`, then switches the user state back. The isolated state is discarded.
 * Isolates `P`'s user state from other parsers.
 *
 * @param innerState
 */
export function isolateState<T>(innerState?: UserState): ParjsCombinator<LoudParser<T>, LoudParser<T>> {
    return rawCombinator(source => {
        return new class IsolateState extends BaseParjsParser {
            expecting = source.expecting;
            protected _apply(ps: ParsingState): void {
                let state = ps.userState;
                ps.userState = cloneDeep(innerState);
                source.apply(ps);
                ps.userState = state;
            }
        }();
    });
}
