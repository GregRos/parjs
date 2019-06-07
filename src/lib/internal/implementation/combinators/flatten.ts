import {LoudParser, ParjsCombinator} from "../../../index";
import {compose} from "./combinator";
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
 * Deep flattening projection combinator. Applies `P` and flattens its result into an array of non-array elements.
 */
export function flatten<T>()
    : ParjsCombinator<LoudParser<NestedArray<T>>, LoudParser<T[]>> {
    return map<NestedArray<T>, T[]>(x => flattenNestedArrays(x));
}
