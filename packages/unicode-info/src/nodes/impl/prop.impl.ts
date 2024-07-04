import { Range } from "@unicode-info/parser";
import { seq } from "stdseq";
import type { TypeName, getPropValue } from "../api/shared.api.js";
import { UniImplGraph } from "./graph.impl.js";
import type { UniCharInput } from "./shared.impl.js";
import { getLongest, getShortest, normalizeString } from "./utils.js";
import { UniImplValue, UniImplValueUnion, type UniImplValueBase } from "./value.impl.js";

/** Implements {@link UnicodeProperty}. Sort of. */
export class UniImplProp<Type extends TypeName = any> {
    _values: (UniImplValue<Type> | UniImplValueUnion<Type>)[] = [];
    _names: Set<string> = new Set();
    readonly type: Type;
    get names() {
        return seq(this._names);
    }

    get longName() {
        return getLongest(this.names);
    }

    getValue(value: getPropValue<Type>) {
        const v = this.tryGetValue(value);
        if (!v) {
            throw new Error(`Value for ${this.longName} not found: ${value}`);
        }
        return v;
    }

    is(prop: UniImplProp<Type> | string) {
        if (typeof prop === "string") {
            return this._names.has(normalizeString(prop));
        }
        return this === prop;
    }

    get formattedName() {
        return `%${this.longName}`;
    }

    get shortName() {
        return getShortest(this.names);
    }

    toString() {
        return `${this.formattedName}: ${this.type}`;
    }

    // Keeping an integer will probably save memory over a reference
    graph!: UniImplGraph;
    get values() {
        return seq(this._values);
    }
    private _valueToSeqId = new Map<getPropValue<Type>, number>();

    constructor(v: getPropValue<Type>, name: string) {
        this._names.add(normalizeString(name));
        this.type = v ? (typeof v as any) : "boolean";
    }

    transientSeqId!: number;

    private __searchValueFor(char: UniCharInput) {
        return this._values.find(v => v.search(char)) as UniImplValue<Type> | undefined;
    }

    getValueFor(char: UniCharInput) {
        if (this.graph.hasDataFlag("char:prop:val")) {
            char = this.graph.char(char);
            return char.getValue(this);
        }
        return this.__searchValueFor(char);
    }

    _registerValue(value: getPropValue<Type>, ranges: Range[]) {
        value = normalizeString(value);
        const v = new UniImplValue(this, value, ranges);
        const seqId = this._values.length;
        this._setTransientSeqIdForValue(value, seqId);
        this._values.push(v);
    }

    _registerAlias(main: UniImplValueBase, aliases: Iterable<getPropValue<Type>>) {
        const seqId = main.transientSeqId;
        for (const alias of aliases) {
            this._setTransientSeqIdForValue(alias, seqId);
            main._addAlias(alias);
        }
    }

    _registerUnion(label: string, values: getPropValue<Type>[]) {
        label = normalizeString(label);
        const valueObjects = seq(values)
            .map(normalizeString)
            .map(x => this.getTransientSeqIdForValue(x))
            .map(seqId => this._values[seqId])
            .toArray()
            .pull();
        const v = new UniImplValueUnion([label], valueObjects);
        const seqId = this._values.length;
        this._setTransientSeqIdForValue(label as any, seqId);
        this._values.push(v);
    }

    private _setTransientSeqIdForValue(value: getPropValue<Type>, seqId: number) {
        value = normalizeString(value);
        this._valueToSeqId.set(value, seqId);
    }

    getTransientSeqIdForValue(value: getPropValue<Type>) {
        value = normalizeString(value);

        return this._valueToSeqId.get(value)!;
    }

    tryGetValue(value: getPropValue<Type>) {
        value = normalizeString(value);

        return this._values[this.getTransientSeqIdForValue(value)];
    }

    tryGetValueFor(char: UniCharInput) {
        return this.__searchValueFor(char);
    }
}
