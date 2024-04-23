import type { ParjsCombinator, UserState } from "../../index";
import { defaults } from "../../utils";
import { Combinated } from "../combinated";
import type { ParjserBase } from "../parser";
import { ParserUserState } from "../parser";
import type { ParsingState } from "../state";
import { wrapImplicit } from "../wrap-implicit";

/** A user state object or a projection to the external user state. */
export type UserStateOrProjection = UserState | ((externalState: UserState) => UserState);

class IsolateState<T> extends Combinated<T, T> {
    type = "replaceState";
    expecting = this.source.expecting;
    constructor(
        source: ParjserBase<T>,
        private readonly innerStateOrCtor: UserStateOrProjection
    ) {
        super(source);
    }
    _apply(ps: ParsingState): void {
        const state = ps.userState;
        const { innerStateOrCtor, source } = this;
        if (typeof innerStateOrCtor === "function") {
            ps.userState = defaults(new ParserUserState(), innerStateOrCtor(state));
        } else {
            ps.userState = defaults(new ParserUserState(), innerStateOrCtor);
        }
        source.apply(ps);
        ps.userState = state;
    }
}

/**
 * When the source parser is applied, the user state will be switched for a different object. After
 * it has finished, the previous user state will be restored. This effectively isolates the source
 * parser's user state.
 *
 * If the given paramter is a function, it will be called on the pre-existing user state to
 * determine the new user state. If it's a non-fuction object, it will be used as the user state
 * instead.
 *
 * @param innerStateOrCtor The new internal user state or a projection on the existing user state.
 */
export function replaceState<T>(innerStateOrCtor: UserStateOrProjection): ParjsCombinator<T, T> {
    return source => new IsolateState(wrapImplicit(source), innerStateOrCtor);
}
