/* eslint-disable @typescript-eslint/no-explicit-any */

import type { CreateTuple, IsInteger, IsPositive } from "type-plus";
import type { DigitArray } from "type-plus/cjs/math/numeric_struct";
import { getNullishPart } from "./type-stuff";

/**
 * Creates `Tuple<T>` with `L` number of elements.
 * @note Other cool implementations by @lazytype, @jcalz:
 * @see https://github.com/microsoft/TypeScript/issues/26223#issuecomment-674514787
 * @see https://github.com/microsoft/TypeScript/issues/47874#issuecomment-1039157322
 */
export type CreateOptionalTuple<L extends number, T = unknown, Fail = never> = number extends L
    ? T[]
    : IsPositive<L> extends true
    ? IsInteger<L> extends true
        ? ToOptionalTuple<[], DigitArray.FromString<`${L}`>, T>
        : Fail
    : Fail;
export type ToOptionalTuple<R extends any[], S extends number[], X = any> = S["length"] extends 0
    ? R
    : S["length"] extends 1
    ? [...R, ...DigitToOptionalTuple<X>[S[0]]]
    : S extends [any, ...infer T]
    ? T extends any[]
        ? ToOptionalTuple<Multi10<[...R, ...DigitToOptionalTuple<X>[S[0]]]>, T>
        : never
    : never;

type DigitToOptionalTuple<T = 1> = {
    [k in number]: any[];
} & {
    0: [];
    1: [T?];
    2: [T?, T?];
    3: [T?, T?, T?];
    4: [T?, T?, T?, T?];
    5: [T?, T?, T?, T?, T?];
    6: [T?, T?, T?, T?, T?, T?];
    7: [T?, T?, T?, T?, T?, T?, T?];
    8: [T?, T?, T?, T?, T?, T?, T?, T?];
    9: [T?, T?, T?, T?, T?, T?, T?, T?, T?];
    10: [T?, T?, T?, T?, T?, T?, T?, T?, T?, T?];
};
type Multi10<C extends any[]> = [...C, ...C, ...C, ...C, ...C, ...C, ...C, ...C, ...C, ...C];
export type GetArrayFromMinMax<T, Min extends number, Max extends number> = [
    ...CreateTuple<Min, T>,
    ...CreateOptionalTuple<Max, T>
];
export type MaybeLookup<T, K> = K extends keyof NonNullable<T>
    ? getNullishPart<T> | NonNullable<T>[K]
    : undefined;
export type getNullishPart<T> = T extends null
    ? T extends undefined
        ? null | undefined
        : null
    : T extends undefined
    ? undefined
    : never;
export type RetainNullability<T, U> = T extends null
    ? T extends undefined
        ? U | null | undefined
        : U | null
    : T extends undefined
    ? U | undefined
    : U;
