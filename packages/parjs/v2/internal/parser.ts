import { CORE, ParjserCore } from "./parser-core";
import { Result } from "./results";
import { isOkay } from "./signals";
import { ParseState, UserState } from "./state";

export class Parjser<R> {
    readonly [CORE]: ParjserCore<R>;
    constructor(core: ParjserCore<R>) {
        this[CORE] = core;
    }

    safeParse(input: string, userState?: UserState): Result<R> {
        const ps = new ParseState(input, userState ?? {});
        const signal = this[CORE].impl(ps);
        if (isOkay(signal)) {
            return {
                isOkay: true,
                value: signal.value
            };
        } else {
            return {
                isOkay: false,
                reason: signal.reason,
                path: ps.path,
                input,
                position: ps.position,
                signalKind: signal.kind
            };
        }
    }
}
