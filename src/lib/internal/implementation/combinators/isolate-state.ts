import {LoudParser, ParjsCombinator, UserState} from "../../../index";
import {rawCombinator} from "./combinator";
import {BaseParjsParser} from "../parser";
import {ParsingState} from "../state";
import {cloneDeep} from "lodash";

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
