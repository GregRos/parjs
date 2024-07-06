import type { BitRange } from "./generic.js";

export namespace PUTrie_LB {
    export const LENGTH = 32 as const;
    export const KEY_WIDTH = Math.log2(LENGTH);
    export const FULL_BIT_KEY_WIDTH = KEY_WIDTH;
    export const FULL_BIT_KEY_MASK = (1 << FULL_BIT_KEY_WIDTH) - 1;
    export type Type = number;
    export const ZeroesValue = 0 as Type;
    export const OnesValue = -1 as Type;
    export const KEY_MASK = (1 << KEY_WIDTH) - 1;

    export function bitIndex(key: number): number {
        const ix = key & KEY_MASK;
        return ix;
    }

    export function getBitmaskAt(key: number): number {
        return 1 << (31 - bitIndex(key));
    }

    export function isSet(int: number, key: number) {
        return 0 !== (int & getBitmaskAt(key));
    }

    export function setBit(data: Type, key: number, value: boolean): Type {
        const bitmask = getBitmaskAt(key);
        return value ? data | bitmask : data & ~bitmask;
    }

    export function fold(ranges: BitRange[], start: number, end: number): Type {
        let bitmap = 0;
        for (let i = start; i <= end; i++) {
            const lb_start = bitIndex(ranges[i].start);
            const lb_end = bitIndex(ranges[i].end);
            const left = -1 >>> lb_start;
            const right = -1 << (LENGTH - lb_end - 1);
            bitmap |= left & right;
        }
        return bitmap;
    }
}
