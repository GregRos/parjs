import { ParseGraphNode } from "./parse-graph";
import { tmp_Signal } from "./signals";
import { ParseState } from "./state";

export abstract class ParjserCore<R> {
    constructor(private readonly _pg: ParseGraphNode) {}
    protected abstract _impl(ps: ParseState): tmp_Signal<R>;
    impl(ps: ParseState): tmp_Signal<R> {
        return this._impl(ps);
    }
}

export const CORE = Symbol("ParjsCore");
