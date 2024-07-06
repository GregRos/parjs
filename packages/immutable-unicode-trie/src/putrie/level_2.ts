import {
    and_getFastReturn,
    FastReturn,
    NodeType,
    or_getFastReturn,
    type BitRange
} from "./generic.js";
import { PUTrie_L1 } from "./level_1.js";
import { PUTrie_LB } from "./level_b.js";

export namespace PUTrie_L2 {
    export const LENGTH = 64 as const;
    export const KEY_WIDTH = Math.log2(LENGTH);
    export const FULL_INT_KEY_WIDTH = PUTrie_L1.FULL_INT_KEY_WIDTH + KEY_WIDTH;
    export const FULL_BIT_KEY_WIDTH = KEY_WIDTH + PUTrie_L1.FULL_BIT_KEY_WIDTH;

    export const KEY_MASK = LENGTH - 1;
    export const FULL_INT_KEY_MASK = (1 << FULL_INT_KEY_WIDTH) - 1;
    export const FULL_BIT_KEY_MASK = (1 << FULL_BIT_KEY_WIDTH) - 1;
    export type Element = PUTrie_L1.Type;
    export type Type = Element[];
    export const Zeroes = [] as Type;
    export const Ones = [PUTrie_L1.Ones] as Type;
    export function empty(fill: Element): Type {
        return new Array(LENGTH).fill(fill);
    }
    export function clone(data: Type, mut: boolean): Type {
        switch (getNodeType(data)) {
            case NodeType.Zeroes:
                return empty(PUTrie_L1.Zeroes);
            case NodeType.Ones:
                return empty(PUTrie_L1.Ones);
        }
        return mut ? data : data.slice();
    }
    export function intIndex(key: number): number {
        return (key >>> PUTrie_L1.FULL_INT_KEY_WIDTH) & KEY_MASK;
    }
    export function bitIndex(key: number): number {
        return (key >>> PUTrie_L1.FULL_BIT_KEY_WIDTH) & KEY_MASK;
    }
    export function getNodeType(target: Type): NodeType {
        switch (target) {
            case Zeroes:
                return NodeType.Zeroes;
            case Ones:
                return NodeType.Ones;
        }
        return NodeType.Real;
    }
    export function getNodeTypes(target: Type, other: Type) {
        return (getNodeType(target) << 2) | getNodeType(other);
    }
    export function and(target: Type, other: Type, mut: boolean): Type {
        switch (and_getFastReturn(getNodeTypes(target, other))) {
            case FastReturn.Left:
                return target;
            case FastReturn.Right:
                return other;
        }
        const data = clone(target, mut);
        for (let i = 0; i < LENGTH; i++) {
            data[i] = PUTrie_L1.and(target[i], other[i], mut);
        }
        return data;
    }
    export function or(target: Type, other: Type, mut: boolean): Type {
        switch (or_getFastReturn(getNodeTypes(target, other))) {
            case FastReturn.Left:
                return target;
            case FastReturn.Right:
                return other;
        }
        const data = clone(target, mut);
        for (let i = 0; i < LENGTH; i++) {
            data[i] = PUTrie_L1.or(target[i], other[i], mut);
        }
        return data;
    }
    export function not(target: Type, mut: boolean): Type {
        switch (getNodeType(target)) {
            case NodeType.Zeroes:
                return Ones;
            case NodeType.Ones:
                return Zeroes;
        }
        const data = clone(target, mut);
        for (let i = 0; i < LENGTH; i++) {
            data[i] = PUTrie_L1.not(target[i], mut);
        }
        return data;
    }
    export function get(target: Type, key: number): number {
        switch (getNodeType(target)) {
            case NodeType.Zeroes:
                return PUTrie_LB.ZeroesValue;
            case NodeType.Ones:
                return PUTrie_LB.OnesValue;
        }
        const level2_idx = intIndex(key);
        const level1 = target[level2_idx];
        return PUTrie_L1.get(level1, key);
    }
    export function getLower(target: Type, at: number): PUTrie_L1.Type {
        switch (getNodeType(target)) {
            case NodeType.Zeroes:
                return PUTrie_L1.Zeroes;
            case NodeType.Ones:
                return PUTrie_L1.Ones;
        }
        return target[at];
    }
    export function set(target: Type, key: number, value: number, mut: boolean): Type {
        const data = clone(target, mut);
        const level2_idx = intIndex(key);
        const level1 = data[level2_idx];
        data[level2_idx] = PUTrie_L1.set(level1, key, value, mut);
        return data;
    }

    export function fold(ranges: BitRange[], start: number, end: number) {
        const result = empty(PUTrie_L1.Zeroes);
        for (let i = start; i <= end; i++) {
            let merge_start = i;
            let l_start = bitIndex(ranges[i].start);
            // First, collect all ranges that have the same L3 bitIndex.
            for (i++; i <= end; i++) {
                if (bitIndex(ranges[i].start) !== l_start) {
                    break;
                }
            }
            // We go back one step because we just left the current L3 key.
            i--;
            // Now, we have all the ranges present in the same L2 node.
            // ONE of them might extend beyond it. We don't want
            // L2 to handle that. Instead we're going to edit the ranges in place.
            // There can't be more than one because then the ranges wouldn't be disjoint.
            const hasTrailingEnd = bitIndex(ranges[i].end) !== l_start;
            let origEnd = ranges[i].end;
            if (hasTrailingEnd) {
                // We have a trailing range that extends across multiple L2 nodes.
                // We're going to edit the range in place to limit it to the last
                // valid index in the current L2 node.
                ranges[i].end =
                    (l_start << PUTrie_L1.FULL_BIT_KEY_WIDTH) | PUTrie_L1.FULL_BIT_KEY_MASK;
            }
            // Now the ranges all terminate within the L2 node and we can fold them
            // into a single node.
            result[l_start] = PUTrie_L1.fold(ranges, merge_start, i);
            if (!hasTrailingEnd) {
                // No trailing end, we're done with this set of ranges.
                continue;
            }
            // Restore the original end:
            ranges[i].end = origEnd;
            // The trailing edge might extend over several nodes, which we'll pad with Ones.
            let l_end = bitIndex(ranges[i].end);
            result.fill(PUTrie_L1.Ones, l_start + 1, l_end);
            // We're left with a remainder. We'll handle it
            // by fixing the start to be the first index of the next L2.
            ranges[i].start = l_end << PUTrie_L1.FULL_BIT_KEY_WIDTH;
            // Now we once again have a range with a different start, so we'll process it in the next iteration.
            i--;
        }
        return result;
    }
}
