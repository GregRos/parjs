import type { BitRange } from "./generic.js";
import { PUTrie_L0 } from "./level_0.js";
import { PUTrie_L1 } from "./level_1.js";
import { PUTrie_L2 } from "./level_2.js";
import { PUTrie_L3 } from "./level_3.js";
import { PUTrie_LB } from "./level_b.js";

export class PUTrie {
    private _3_level0: PUTrie_L0.Type;
    private _3_level1: PUTrie_L1.Type;
    private _3_level2: PUTrie_L2.Type;
    private constructor(private _level3: PUTrie_L3.Type) {
        // We cache the first node at each level for faster indexing
        this._3_level2 = PUTrie_L3.getLower(_level3, 0);
        this._3_level1 = PUTrie_L2.getLower(this._3_level2, 0);
        this._3_level0 = PUTrie_L1.getLower(this._3_level1, 0);
    }

    static empty(): PUTrie {
        return new PUTrie(PUTrie_L3.Zeroes);
    }

    and(other: PUTrie, mut: boolean): PUTrie {
        return new PUTrie(PUTrie_L3.and(this._level3, other._level3, mut));
    }

    or(other: PUTrie, mut: boolean): PUTrie {
        return new PUTrie(PUTrie_L3.or(this._level3, other._level3, mut));
    }

    not(mut: boolean): PUTrie {
        return new PUTrie(PUTrie_L3.not(this._level3, mut));
    }

    getInt(index: number): number {
        if (index <= PUTrie_L0.FULL_INT_KEY_MASK) {
            return PUTrie_L0.get(this._3_level0, index);
        }
        if (index <= PUTrie_L1.FULL_INT_KEY_MASK) {
            return PUTrie_L1.get(this._3_level1, index);
        }
        if (index <= PUTrie_L2.FULL_INT_KEY_MASK) {
            return PUTrie_L2.get(this._3_level2, index);
        }
        return PUTrie_L3.get(this._level3, index);
    }

    getBit(index: number): boolean {
        const intIndex = index >>> PUTrie_LB.FULL_BIT_KEY_WIDTH;
        const bitIndex = PUTrie_LB.bitIndex(index);
        const int = this.getInt(intIndex);
        return PUTrie_LB.isSet(int, bitIndex);
    }

    private _newLevel3(level3: PUTrie_L3.Type): PUTrie {
        return new PUTrie(level3);
    }

    setBit(index: number, value: boolean, mut: boolean): PUTrie {
        let intIndex = index >>> PUTrie_LB.FULL_BIT_KEY_WIDTH;
        let int = PUTrie_L3.get(this._level3, intIndex);
        int = PUTrie_LB.setBit(int, index & PUTrie_LB.KEY_MASK, value);
        return this._newLevel3(PUTrie_L3.set(this._level3, intIndex, int, mut));
    }

    static fromRanges(ranges: BitRange[] | readonly (readonly [number, number])[]) {
        if (ranges.length === 0) {
            return PUTrie.empty();
        }
        if (Array.isArray(ranges[0])) {
            ranges = ranges as [number, number][];
            ranges = ranges.map(([start, end]) => ({ start, end }));
            return new PUTrie(PUTrie_L3.fold(ranges));
        }
        return new PUTrie(PUTrie_L3.fold(ranges as BitRange[]));
    }
}
