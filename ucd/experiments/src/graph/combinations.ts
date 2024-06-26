import type { Codepoint, Combination } from "./codepoint.js";

export class Combinations {
    private readonly _bySeqId: Combination[] = [];
    private readonly _combos = new Map<string, Combination>();

    private _getKey(combo: Combination) {
        return [combo.script.value, combo.block.value, combo.category.value].join(",");
    }
    constructor(combinations: Combination[] = []) {
        for (const combo of combinations) {
            this._combos.set(this._getKey(combo), combo);
        }
        this._bySeqId = combinations;
    }

    getById(seqId: number) {
        return this._bySeqId[seqId];
    }

    filter(fn: (combo: Combination) => boolean) {
        return new Combinations([...this._combos.values()].filter(fn).map(x => x));
    }

    toArray() {
        return [...this._combos.values()];
    }

    get size() {
        return this._combos.size;
    }

    get(cp: Codepoint) {
        return this._combos.get(this._getKey(cp.combination));
    }
}
