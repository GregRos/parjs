import type { Range } from "@unicode-info/parser";
import { seq } from "stdseq";
import type { UniImplChar } from "./char.impl.js";
import type { UniImplProp } from "./prop.impl.js";
import type { UniCharInput, ValSeqId } from "./shared.impl.js";
import { getLongest, getShortest, normalizeToCodepoint } from "./utils.js";
import { type UniImplValue } from "./value.impl.js";

/** Implements {@link UnicodeScriptxProperty}. Sort of. */
export class UniImplScriptxProp {
    readonly _names: Set<string> = new Set();
    readonly _extensions = new Map<ValSeqId, Range[]>();
    readonly _charToScripts = new Map<number, Set<ValSeqId>>();
    get graph() {
        return this._scriptProp.graph;
    }
    get names() {
        return seq(this._names);
    }
    get shortName() {
        return getShortest(this.names);
    }
    get longName() {
        return getLongest(this.names);
    }
    constructor(readonly _scriptProp: UniImplProp<"string">) {}

    get scripts() {
        return seq(this._scriptProp.values);
    }

    scriptFor(char: UniCharInput) {
        char = normalizeToCodepoint(char);
        const script = this._scriptProp.getValueFor(char);
        if (!script) {
            return undefined;
        }
        return new UniImplScriptxValue(this, script);
    }

    scriptsFor(char: UniCharInput) {
        char = normalizeToCodepoint(char);
        const mainScript = this.scriptFor(char);
        const scripts = seq(this._extensions)
            .map(([id, ranges]) => {
                if (ranges.some(range => range.contains(char))) {
                    return this.script(id);
                }
            })
            .filter(x => !!x);
        return mainScript ? scripts.startWith(mainScript) : scripts;
    }

    script(nameOrId: string | number) {
        const id =
            typeof nameOrId === "string"
                ? this._scriptProp.getTransientSeqIdForValue(nameOrId)
                : nameOrId;
        return new UniImplScriptxValue(
            this,
            this._scriptProp._values[id] as UniImplValue<"string">
        );
    }

    _bindRangesToScripts(values: string[], ranges: Range[]) {
        const seqIds = values.map(value => this._scriptProp.getTransientSeqIdForValue(value));
        for (const seqId of seqIds) {
            let existing = this._extensions.get(seqId);
            if (!existing) {
                existing = [];
                this._extensions.set(seqId, existing);
            }
            existing.push(...ranges);
        }

        if (this.graph.hasDataFlag("char:prop:val")) {
            for (const codepoint of seq(ranges).concatMap(x => x)) {
                let existing = this._charToScripts.get(codepoint);
                if (!existing) {
                    existing = new Set();
                    this._charToScripts.set(codepoint, existing);
                }
                for (const seqId of seqIds) {
                    existing.add(seqId);
                }
            }
        }
    }
}

export class UniImplScriptxValue {
    constructor(
        readonly property: UniImplScriptxProp,
        private _scriptValue: UniImplValue<"string">
    ) {}

    get values() {
        return this._scriptValue.values;
    }

    get transientSeqId() {
        return this._scriptValue.transientSeqId;
    }

    get shortLabel() {
        return this._scriptValue.shortLabel;
    }

    get longLabel() {
        return this._scriptValue.longLabel;
    }

    toString() {
        return `@${this.property.longName}=${this.longLabel}`;
    }

    get chars() {
        const self = this;
        return seq(function* () {
            let allCodepoints = seq(self._scriptValue.ranges).concatMap(x => x);
            const extensions = self.property._extensions.get(self.transientSeqId);
            if (extensions) {
                allCodepoints = allCodepoints.concat(...extensions);
            }
            for (const codepoint of allCodepoints) {
                yield self.property.graph.char(codepoint);
            }
        });
    }

    get graph() {
        return this.property.graph;
    }

    has(codepoint: number | UniImplChar) {
        codepoint = normalizeToCodepoint(codepoint);
        if (this._scriptValue.has(codepoint)) {
            return true;
        }
        if (this.graph.hasDataFlag("char:prop:val")) {
            const forChar = this.property._charToScripts.get(codepoint);
            return forChar?.has(codepoint) ?? false;
        }
        const extension = this.property._extensions.get(this.transientSeqId);
        return extension?.some(range => range.contains(codepoint)) ?? false;
    }
}
