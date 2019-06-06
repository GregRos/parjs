import {LoudParser, ParjsCombinator} from "../../../index";

export function cast<A, B>(projection: (x: A) => B): ParjsCombinator<LoudParser<A>, LoudParser<B>> {
    return x => x as LoudParser<B>;
}
