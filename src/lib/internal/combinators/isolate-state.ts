/** @module parjs/combinators */ /** */

import {ParjsCombinator, UserState} from "../../index";
import {defineCombinator} from "./combinator";
import {ParjserBase} from "../parser";
import {ParsingState} from "../state";
import cloneDeep from "lodash/cloneDeep";

/**
 * Replaces the user state with `innerState`, applies the source parser and
 * then restores the previous user state before yielding the source parser's
 * result. This isolates the source parser's user state.
 *
 * @param innerState
 */
export function isolateState<T>(innerState?: UserState): ParjsCombinator<T, T> {
    return defineCombinator(source => {
        return new class IsolateState extends ParjserBase {
            type = "isolateState";
            expecting = source.expecting;
            _apply(ps: ParsingState): void {
                let state = ps.userState;
                ps.userState = cloneDeep(innerState);
                source.apply(ps);
                ps.userState = state;
            }
        }();
    });
}
