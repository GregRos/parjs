import type { FailureInfo } from "../result";
import type { ParsingState } from "../state";

import type { ParjsCombinator } from "../parjser";
import type { ParjserBase } from "../parser";

import defaults from "lodash/defaults";
import { Combinated } from "../combinated";
import { wrapImplicit } from "../scalar-converter";

const defaultFailure: FailureInfo = {
    reason: "succeeded without capturing input",
    kind: "Hard"
};

class MustCapture<T> extends Combinated<T, T> {
    expecting = `expecting internal parser ${this.source.type} to consume input`;
    type = "mustCapture";
    constructor(
        source: ParjserBase<T>,
        private readonly _failure: FailureInfo,
        private readonly _predicate: (captured: string) => boolean = x => x.length > 0
    ) {
        super(source);
    }

    _apply(ps: ParsingState) {
        const { position } = ps;
        this.source.apply(ps);
        if (!ps.isOk) {
            return;
        }
        const captured = ps.input.slice(position, ps.position);
        if (this._predicate(captured)) {
            ps.kind = this._failure.kind;
            ps.reason = this._failure.reason;
        }
    }
}

/**
 * Applies the source parser and makes sure it captured some input.
 * @param pFailure The failure info.
 */
export function mustCapture<T>(pFailure?: Partial<FailureInfo>): ParjsCombinator<T, T> {
    const failure = defaults(pFailure, defaultFailure);
    return source => new MustCapture(wrapImplicit(source), failure);
}
