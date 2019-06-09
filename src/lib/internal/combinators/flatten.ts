import {Parjser, ParjsCombinator} from "../../index";
import {composeCombinator} from "./combinator";
import {map} from "./map";

export type NestedArray<T> = T | T[] | T[][] | T[][][] | T[][][][] | T[][][][][] | T[][][][][][] | T[][][][][][][][];

function flattenNestedArrays(arr: unknown[] | unknown) {
    if (!Array.isArray(arr)) {
        return [arr];
    }
    let items = [];
    for (let item of arr) {
        if (Array.isArray(item)) {
            items.push(...flattenNestedArrays(item));
        } else {
            items.push(item);
        }
    }
    return items;
}

/**
 * Applies the source parser and projects its result into a flat array - an array
 * with non-array elements.
 */
export function flatten<T>()
    : ParjsCombinator<NestedArray<T>, T[]> {
    return map<NestedArray<T>, T[]>(x => flattenNestedArrays(x));
}
