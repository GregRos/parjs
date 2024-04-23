import type { Parjser } from "./parjser";
import type { ImplicitParjser } from "./wrap-implicit";

export type union<Args extends unknown[]> = Args extends [
    infer A,
    infer B,
    infer C,
    infer D,
    infer E,
    ...infer Rest
]
    ? A | B | C | D | E | union<Rest>
    : Args extends [infer A, infer B, infer C, infer D, ...infer Rest]
      ? A | B | C | D | union<Rest>
      : Args extends [infer A, infer B, infer C, ...infer Rest]
        ? A | B | C | union<Rest>
        : Args extends [infer A, infer B, ...infer Rest]
          ? A | B | union<Rest>
          : Args extends [infer A, ...infer Rest]
            ? A | union<Rest>
            : never;
export type getParsedType<T extends ImplicitParjser<unknown>> = T extends RegExp
    ? string[]
    : T extends string
      ? T
      : T extends Parjser<infer U>
        ? U
        : never;
