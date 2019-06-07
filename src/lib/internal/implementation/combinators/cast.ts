import {LoudParser, ParjsCombinator} from "../../../index";

export function cast<A, B>(projection: (x: A) => B): ParjsCombinator<A, B> {
    return x => x as unknown as LoudParser<B>;
}
