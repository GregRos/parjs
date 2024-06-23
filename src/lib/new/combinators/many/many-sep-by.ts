import type { ParserImpl } from "../../parser";
import { R } from "../../state/result";
import type { RuntimeArgs, RuntimeOutput, __ManyArgs, getManyOutput } from "./types";

abstract class ImplBase<Args, Output> implements ParserImpl<Output> {
    readonly type = this.constructor.name;
    constructor(protected readonly _options: RuntimeArgs<Args>) {}
    apply(stackLabel: string, state: sta<any>): State<RuntimeOutput<Output>> {}
    protected abstract _apply(state: State<any>): State<RuntimeOutput<Output>>;
    abstract caseSense(caseSensitive: boolean): this;
}

class Many extends ImplBase<__ManyArgs, getManyOutput<__ManyArgs>> {
    override caseSense(caseSensitive: boolean): this {
        return new Many({
            ...this._options,
            source: this._options.source.caseSense(caseSensitive),
            till: this._options.till?.caseSense(caseSensitive) ?? null,
            sepBy: this._options.sepBy?.caseSense(caseSensitive) ?? null
        }) satisfies Many as any;
    }
    constructor(options: RuntimeArgs<__ManyArgs>) {
        super(options);
    }
    protected override _makeEmptyResult(): RuntimeOutput<getManyOutput<__ManyArgs>> {
        const ro = {
            matches: [],
            separators: [],
            closer: undefined
        };
        return {
            ...ro,
            default: ro.matches
        };
    }
    apply(frameLabel: string, ps: State<any>): any {
        const { source, min = 0, max = Infinity, sepBy, till } = this._options;
        let applied = 0;
        let state = ps;
        const results = this._makeEmptyResult();
        for (;;) {
            if (applied >= max) break;
            if (till) {
                const nextState = till.apply("till", ps);
                if (nextState.kind === R.Ok) {
                    results.closer = nextState.value;
                    break;
                } else if (nextState.kind === R.Panic || nextState.kind === R.Die) {
                    return ps;
                }
            }
            if (applied > 0 && sepBy) {
                const nextState = sepBy.apply("sepBy", ps);
                if (nextState.kind === R.Nope) {
                    break;
                } else if (nextState.kind === R.Panic || nextState.kind === R.Die) {
                    return ps;
                }
                results.separators.push(nextState.value);
            }
            const nextState = source.apply("", ps);
            if (nextState.kind === R.Ok) {
                results.matches.push(nextState.value);
                applied++;
            } else if (nextState.kind === R.Nope) {
                break;
            }
            applied++;
        }
        if (applied === 0 && applied < min) {
        }
        ps.value = results;
    }
}
