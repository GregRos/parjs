import type { ReplaceProperty } from "type-plus";

import type { Configurable } from "../../combinators";
import type { Parser, implementation } from "../../parser";
import type { GetArrayFromMinMax } from "../../type-stuff";
import { MaybeLookup } from "../../type-stuff";

export interface ManyCombinator<Args extends __ManyArgs>
    extends Configurable<Args["source"], getManyOutput<Args>> {
    min<const Min2 extends number>(min: Min2): ManyCombinator<ReplaceProperty<Args, "min", Min2>>;
    max<const Max2 extends number>(max: Max2): ManyCombinator<ReplaceProperty<Args, "max", Max2>>;
    till<Till2 extends Parser>(till: Till2): ManyCombinator<ReplaceProperty<Args, "till", Till2>>;
    exactly<const N extends number>(n: N): ManyCombinator<ReplaceProperty<Args, "min" | "max", N>>;
    sepBy<SepBy2 extends Parser>(
        sepBy: SepBy2
    ): ManyCombinator<ReplaceProperty<Args, "sepBy", SepBy2>>;
}
export type getManyOutput<Args extends __ManyArgs> = {
    default: GetArrayFromMinMax<Args["source"]["__Returns"], Args["min"], Args["max"]>;
    matches: GetArrayFromMinMax<Args["source"]["__Returns"], Args["min"], Args["max"]>;
    separators: GetArrayFromMinMax<
        MaybeLookup<Args["source"], "__Returns">,
        Args["min"],
        Args["max"]
    >;
    closer: MaybeLookup<Args["till"], "__Returns">;
};

export type RuntimeArgs<T> = {
    [K in keyof T]: MaybeLookup<T[K], typeof implementation>;
};

export type RuntimeOutput<T> = {
    [K in keyof T]: T[K] extends (infer E)[] ? E[] : T[K];
};

export interface __ManyArgs {
    source: Parser;
    min: number;
    max: number;
    till: Parser | null;
    sepBy: Parser | null;
}
