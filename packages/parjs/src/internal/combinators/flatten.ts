import type { ParjsCombinator } from "../parjser";
import { map } from "./map";

/** The type of an arbitrarily nested array or a non-array element. */
export type NestedArray<T> = T | NestedArray<T>[];

function flattenNestedArrays<T>(arr: NestedArray<T>): T[] {
    if (!Array.isArray(arr)) {
        return [arr];
    }
    const items = [] as T[];
    for (const item of arr) {
        if (Array.isArray(item)) {
            items.push(...flattenNestedArrays(item));
        } else {
            items.push(item);
        }
    }
    return items;
}

/**
 * Applies the source parser and projects its result into a flat array - an array with non-array
 * elements.
 */
export function flatten<T>(): ParjsCombinator<NestedArray<T>, T[]> {
    return map<NestedArray<T>, T[]>(x => flattenNestedArrays(x));
}
