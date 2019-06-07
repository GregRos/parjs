
import {BaseParjsParser} from "../parser";
import {LoudParser, ParjsCombinator} from "../../../";

export function defineCombinator(f: (act: BaseParjsParser) => LoudParser<any>) {
    return f as ParjsCombinator<any, any>;
}

export function composeCombinator<A, B>(
    f1: ParjsCombinator<A, B>
): ParjsCombinator<A, B>;
export function composeCombinator<A, B, C>(
    f1: ParjsCombinator<A, B>,
    f2: ParjsCombinator<B, C>
): ParjsCombinator<A, C>;
export function composeCombinator<A, B, C, D>(
    f1: ParjsCombinator<A, B>,
    f2: ParjsCombinator<B, C>,
    f3: ParjsCombinator<C, D>
): ParjsCombinator<A, D>;
export function composeCombinator(...fs: ParjsCombinator<any, any>[]) {
    return x => {
        let last = x;
        for (let f of fs) {
            last = f(last);
        }
        return last;
    };
}
