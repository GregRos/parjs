import { Range } from "@unicode-info/parser";
import util from "node:util";
import { lazy } from "stdlazy";
import { seq, type Seq } from "stdseq";
import type { TypeName, getPropValue } from "../api/shared.api.js";
import type { UniImplChar } from "./char.impl.js";
import { UniImplProp } from "./prop.impl.js";
import type { UniCharInput } from "./shared.impl.js";
import { getLongest, getShortest, normalizeString, normalizeToCodepoint } from "./utils.js";
export interface UniImplValueBase<Type extends TypeName = TypeName> extends Iterable<UniImplChar> {
    get localId(): number;
    readonly property: any;
    readonly ranges: Seq<Range>;
    readonly shortLabel: string;
    readonly longLabel: string;
    subsetOf(value: UniImplValueBase<Type> | getPropValue<Type>): boolean;
    toString(): string;
    has(codepoint: UniCharInput): boolean;
    search(char: UniCharInput): boolean;
    _addAlias(alias: getPropValue<Type>): void;
}
/** Implements {@link UnicodeValue}. Sort of. */

export class UniImplValue<Type extends TypeName = TypeName> implements UniImplValueBase<Type> {
    readonly _values: Set<getPropValue<Type>> = new Set();
    get graph() {
        return this.property.graph;
    }

    [Symbol.iterator]() {
        return seq(this.ranges)
            .concatMap(x => x)
            .map(x => this.graph.char(x))
            [Symbol.iterator]();
    }

    get type() {
        return this.property.type as Type;
    }
    get label() {
        return `${this.values.at(0).pull()}`;
    }
    get values() {
        return seq(this._values);
    }
    _addAlias(alias: getPropValue<Type>): void {
        this._values.add(alias);
    }
    get shortLabel(): string {
        return getShortest(this.values);
    }
    get longLabel(): string {
        return getLongest(this.values);
    }

    constructor(
        readonly property: UniImplProp<Type>,
        value: getPropValue<Type>,
        private _ranges: Range[]
    ) {
        value = normalizeString(value);
        this._values.add(value);
    }

    get ranges() {
        return seq(this._ranges);
    }
    subsetOf(other: UniImplValueBase<Type> | getPropValue<Type>): boolean {
        if (typeof other !== "object") {
            other = this.property.tryGetValue(other);
            if (!other) {
                return false;
            }
        }
        if (other instanceof UniImplValue) {
            return this.values.equals(other.values, "set").pull();
        }
        if (other instanceof UniImplValueUnion) {
            return other.items.some(x => x.subsetOf(this as any)).pull();
        }

        return false;
    }
    search(char: UniCharInput) {
        char = normalizeToCodepoint(char);
        return this.ranges.some(range => range.contains(char)).pull();
    }
    has(codepoint: UniCharInput) {
        codepoint = normalizeToCodepoint(codepoint);
        if (this.property.graph.hasDataFlag("char:prop:val")) {
            return this.property.graph.char(codepoint).getValue(this.property) === this;
        }
        return this.ranges.some(range => range.contains(codepoint)).pull();
    }

    is(value: getPropValue<Type>): boolean {
        value = normalizeString(value);
        return this._values.has(value);
    }
    get localId() {
        return this.property.getTransientSeqIdForValue(seq(this.values).first().pull()! as any);
    }
    get key() {
        const propId = this.property.key;
        const vId = this.localId;
        return (propId << 16) | vId;
    }
    toString() {
        const parts = [this.property.formattedName] as any[];
        if (this.property.type !== "boolean") {
            parts.push(this.values.at(0).pull()!);
        }
        return parts.join("=");
    }
}
/** Implements {@link UnicodeValueUnion}. Sort of. */

export class UniImplValueUnion<Type extends TypeName = TypeName> implements UniImplValueBase<Type> {
    _unionValues: UniImplValueBase<Type>[] = [];
    get property() {
        return seq(this._unionValues)
            .map(x => x.property)
            .first()
            .pull()!;
    }

    get localId() {
        return this.property.getTransientSeqIdForValue(this.shortLabel);
    }

    constructor(
        readonly _labels: string[],
        unionArgs: UniImplValueBase<Type>[]
    ) {
        const propsCount = seq(unionArgs)
            .map(x => x.property)
            .uniq()
            .count()
            .pull();

        if (propsCount !== 1) {
            throw new Error("Union values must have the same property");
        }
        this._unionValues = unionArgs.flatMap(x =>
            x instanceof UniImplValueUnion ? x._unionValues : [x]
        );
    }

    get ranges() {
        return seq(this._unionValues).concatMap(x => x.ranges);
    }
    get items() {
        return seq(this._unionValues);
    }
    [Symbol.iterator]() {
        return seq(this._unionValues)
            .concatMap(x => x)
            [Symbol.iterator]();
    }

    private _shortLabel = lazy(() => {
        return this.items.map(x => x.shortLabel).strJoin(" | ");
    });
    get shortLabel() {
        const shortestLabel = seq(this._labels)
            .minBy(x => x.length)
            .pull();
        return shortestLabel ?? this._shortLabel.pull();
    }
    private _longLabel = lazy(() => {
        return this.items
            .map(x => x.longLabel)
            .strJoin(" | ")
            .map(x => `(${x})`);
    });
    get longLabel() {
        const longestLabel = seq(this._labels)
            .maxBy(x => x.length)
            .pull();
        return longestLabel ?? this._longLabel.pull();
    }

    subsetOf(value: UniImplValueBase<Type> | getPropValue<Type>): boolean {
        return this.items.every(x => x.subsetOf(value)).pull();
    }
    has(codepoint: UniCharInput): boolean {
        codepoint = normalizeToCodepoint(codepoint);
        return this._unionValues.some(x => x.has(codepoint));
    }
    search(char: UniCharInput) {
        char = normalizeToCodepoint(char);
        return this._unionValues.some(x => x.search(char));
    }
    toString(): string {
        return `${this.property.formattedName}=${this.longLabel}`;
    }

    [util.inspect.custom](...args: any[]): string {
        return this.toString();
    }

    _addAlias(alias: getPropValue<Type>): void {
        this._labels.push(alias as any);
    }
}
