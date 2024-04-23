import type { ParjsCombinator } from "../../";
import { Combinated } from "../combinated";
import { ResultKind } from "../result";
import type { ParsingState } from "../state";
import { wrapImplicit } from "../wrap-implicit";

class Not extends Combinated<unknown, void> {
    type = "not";
    expecting = `not expecting: ${this.source.expecting}`; // TODO: better reason

    _apply(ps: ParsingState): void {
        const { position } = ps;
        this.source.apply(ps);
        if (ps.isOk) {
            ps.position = position;
            ps.kind = ResultKind.SoftFail;
        } else if (ps.kind === ResultKind.HardFail || ps.kind === ResultKind.SoftFail) {
            // hard fails are okay here
            ps.kind = ResultKind.Ok;
            ps.position = position;
            return;
        }
        // the remaining case is a fatal failure that isn't recovered from.
    }
}

/** Applies the source parser. Succeeds if if it fails softly, and fails otherwise. */
export function not(): ParjsCombinator<unknown, void> {
    return source => new Not(wrapImplicit(source));
}
