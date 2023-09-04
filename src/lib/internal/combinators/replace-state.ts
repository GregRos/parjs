/** @module parjs/combinators */ /** */

import { ParjsCombinator, UserState } from "../../index";
import { defineCombinator } from "./combinator";
import { ParjserBase, ParserUserState } from "../parser";
import { ParsingState } from "../state";
import defaults from "lodash/defaults";

/**
 * A user state object or a projection to the external user state.
 */
export type UserStateOrProjection = UserState | ((externalState: UserState) => UserState);

/**
 * When the source parser is applied, the user state will be switched for a
 * different object. After it has finished, the previous user state will be
 * restored. This effectively isolates the source parser's user state.
 *
 * If the given paramter is a function, it will be called on the pre-existing user
 * state to determine the new user state. If it's a non-fuction object, it will
 * be used as the user state instead.
 *
 * @param innerStateOrCtor The new internal user state or a projection on the
 * existing user state.
 */
export function replaceState<T>(innerStateOrCtor: UserStateOrProjection): ParjsCombinator<T, T> {
    return defineCombinator(source => {
        return new (class IsolateState extends ParjserBase {
            type = "replaceState";
            expecting = source.expecting;
            _apply(ps: ParsingState): void {
                const state = ps.userState;
                if (typeof innerStateOrCtor === "function") {
                    ps.userState = defaults(new ParserUserState(), innerStateOrCtor(state));
                } else {
                    ps.userState = defaults(new ParserUserState(), innerStateOrCtor);
                }
                source.apply(ps);
                ps.userState = state;
            }
        })();
    });
}
