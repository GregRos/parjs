import { ConfigurableFetcher, UCD } from "@unimatch/fetcher";
import { Range, pUnicodeData } from "@unimatch/parser";
import { seq } from "stdseq";
import {
    pGraphBlocks,
    pGraphDerivedCategories,
    pGraphDerivedCoreProperties,
    pGraphEmojiData,
    pGraphPropertyAliases,
    pGraphPropertyValueAliases,
    pGraphScripts
} from "../parsers.js";
import type { Data, StandardPropNames, TypeName, getPropValue } from "./graph.api.js";
export type Level = Data.Max;

export type ComboSeqId = number;
export type PropSeqId = number;
export type ValSeqId = number;
export type Codepoint = number;
const fetcher = new ConfigurableFetcher("15.1.0");
export class UniGraph {
    combos!: Map<Codepoint, Map<UniProp, UniValue>>;
    levels: Set<Level>;
    props: UniProp[] = [];
    private _nameToProp!: Map<string, UniProp<any>>;
    private _codeToTitle!: Map<Codepoint, string>;
    constructor(levels: Level[]) {
        this.levels = new Set(levels);
    }

    static async create(levels: Level[]) {
        const graph = new UniGraph(levels);
        const results = await fetcher.fetchParsed({
            [UCD.PropertyAliases]: pGraphPropertyAliases,
            [UCD.Scripts]: pGraphScripts,
            [UCD.UnicodeData]: pUnicodeData,
            [UCD.DerivedCoreProperties]: pGraphDerivedCoreProperties,
            [UCD.DerivedGeneralCategory]: pGraphDerivedCategories,
            [UCD.PropertyValueAliases]: pGraphPropertyValueAliases,
            [UCD.EmojiData]: pGraphEmojiData,
            [UCD.Blocks]: pGraphBlocks
        });
        const props = [
            ...results[UCD.DerivedCoreProperties],
            ...results[UCD.EmojiData],
            results[UCD.Scripts],
            results[UCD.Blocks],
            results[UCD.DerivedGeneralCategory]
        ];
        const propsMap = new Map<string, UniProp<any>>();
        for (const prop of props) {
            propsMap.set(prop.name, prop);
            const aliases = results[UCD.PropertyAliases].get(prop.name);
            if (!aliases) {
                continue;
            }
            graph._registerAliases(prop, ...aliases.longNames);
        }

        for (const altEntry of results[UCD.PropertyValueAliases].values()) {
            const prop = propsMap.get(altEntry.name);
            if (!prop) {
                throw new Error(`Property not found: ${altEntry.name}`);
            }
            if (prop.type !== "string") {
                throw new Error(
                    `Property ${altEntry.name} is of type ${prop.type}, which isn't supposed to have alt values`
                );
            }
            const strProp = prop as UniProp<"string">;
            for (const alias of altEntry.valueAlts.values()) {
                const value = strProp.values.find(v => v.value === alias.shortValue);
                if (!value) {
                    throw new Error(`Value not found: ${alias.shortValue}`);
                }
                for (const longValue of alias.longValues) {
                    strProp._registerAlts(value, longValue);
                }
            }
        }
        if (graph.hasData("Char.Name") || graph.hasData("Char.Props")) {
            graph._codeToTitle = new Map();
            for (const row of results[UCD.UnicodeData]) {
                if (graph.hasData("Char.Name")) {
                    graph._codeToTitle.set(row.codepoint, row.name);
                }
                if (graph.hasData("Char.Props")) {
                    const char = graph._makeChar(row.codepoint);
                    for (const prop of props) {
                        const value = prop.v  alues;
                        if (value) {
                            char._vals.set(prop, value);
                        }
                    }
                }
            }
        }
        if (graph.hasData("Prop.Chars")) {
            for (const prop of props) {
                prop._loadChars();
            }
        }
        if (graph.hasData("Char.Props")) {
        }
    }

    hasData(level: Level) {
        return this.levels.has(level);
    }

    _registerTitle(codepoint: number, title: string) {
        this._codeToTitle.set(codepoint, title);
    }

    get blocks() {
        return this._nameToProp.get("Block")!.values;
    }
    get categories() {
        return this._nameToProp.get("Category")!.values;
    }
    get scripts() {
        return this._nameToProp.get("Script")!.values;
    }
    prop(name: StandardPropNames): UniProp<"string">;
    prop<Type extends TypeName>(name: string, type?: Type): UniProp<Type>;
    prop(name: string, type?: TypeName) {
        const found = this._nameToProp.get(name);
        if (!found) {
            throw new Error(`Property not found: ${name}`);
        }
        if (type && found.type !== type) {
            throw new Error(`Property ${name} is of type ${found.type}, expected ${type}`);
        }
        return found;
    }

    private _makeChar(code: number) {
        return new Char(code, this, this._codeToTitle.get(code));
    }
    char(code: number) {
        const chr = this._makeChar(code);
        return chr;
    }

    _registerAliases(to: UniProp, ...aliases: string[]) {
        for (const alias of aliases) {
            this._nameToProp.set(alias, to);
        }
        to.aliases.push(...aliases);
    }

    _createProp<Type extends TypeName>(type: Type, name: string) {
        const prop = new UniProp(type, this.props.length, name);
        this._nameToProp.set(name, prop);
        this.props.push(prop);
    }
}

export class UniProp<Type extends TypeName = TypeName> {
    values: UniValue<Type>[] = [];
    seqId: number = -1;
    private _valueToSeqId = new Map<getPropValue<Type>, number>();
    // Keeping an integer will probably save memory over a reference
    private _charToSeqId?: Map<number, number>;
    readonly aliases: string[] = [];
    root!: UniGraph;

    valueOf(char: Char | number) {
        char = typeof char === "number" ? char : char.code;
        if (this._charToSeqId) {
            const seqId = this._charToSeqId.get(char);
            if (seqId !== undefined) {
                return this.values[seqId];
            }
        }
        return this.values.find(v => v.has(char));
    }
    constructor(
        readonly type: Type,
        readonly name: string
    ) {}

    is(prop: UniProp<Type> | string | number) {
        if (typeof prop === "string") {
            return this.name === prop;
        }
        if (typeof prop === "number") {
            return this.seqId === prop;
        }
        return this === prop;
    }

    _registerValue(value: getPropValue<Type>, ranges: Range[]) {
        const seqId = this.values.length;
        this._valueToSeqId.set(value, seqId);
        this.values.push(new UniValue(this, value, ranges));
    }

    _loadChars() {
        let i = 0;
        this._charToSeqId = new Map();
        for (const v of this.values) {
            for (const range of v.ranges) {
                for (let code = range.start; code <= range.end; code++) {
                    this._charToSeqId.set(code, i);
                }
            }
            i++;
        }
    }

    _registerAlts(value: getPropValue<Type> | UniValue<Type>, ...alts: getPropValue<Type>[]) {
        if (this.type !== "string") {
            throw new Error(
                `Property ${this.name} has type ${this.type}, not string, so it can't have alt values`
            );
        }
        value = value instanceof UniValue ? value.value : value;
        const seqId = this._valueToSeqId.get(value)!;
        const val = this.values[seqId]!;
        val.alts.push(...alts);
        for (const alt of alts) {
            this._valueToSeqId.set(alt, seqId);
        }
    }

    toString() {
        return `Unicode(${this.name}: ${this.type}) [${this.seqId}]`;
    }
}

export class UniValue<Type extends TypeName = TypeName> {
    readonly alts: getPropValue<Type>[] = [];

    get chars() {
        return seq(this.ranges).concatMap(x => x);
    }
    get root() {
        return this.owner.root;
    }
    constructor(
        readonly owner: UniProp<Type>,
        readonly value: getPropValue<Type>,
        readonly ranges: Range[]
    ) {}

    is(value: getPropValue<Type> | UniValue<Type>) {
        if (value instanceof UniValue) {
            return this.value === value.value && this.owner === value.owner;
        } else if (typeof value !== "string") {
            return false;
        }
        return this.value === value;
    }
    has(codepoint: number) {
        if (this.owner.root.hasData("Char.Props")) {
            return this.
        }
        return this.ranges.some(range => range.contains(codepoint));
    }

    toString() {
        if (this.owner.type === "boolean") {
            return `UniProp[${this.owner.name}]`;
        }
        return `UniValue[${this.owner}=${this.value}]`;
    }
}
export class Char {
    get _vals() {
        return this.root.combos.get(this.code)!;
    }
    get script() {
        return this._vals.get(this.root.prop("Script"));
    }
    get block() {
        return this._vals.get(this.root.prop("Block"));
    }
    get category() {
        return this._vals.get(this.root.prop("Category"));
    }
    constructor(
        readonly code: number,
        readonly root: UniGraph,
        readonly title: string | undefined
    ) {
        if (code < 0 || code > 0x10ffff) {
            throw new Error(`Codepoint ${this} is outside the Unicode range`);
        }
    }

    get hex() {
        return this.code.toString(16).toUpperCase();
    }

    get label() {
        return `U+${this.hex}`;
    }

    get example() {
        return String.fromCodePoint(this.code);
    }

    get values() {
        return this._vals.values();
    }

    is(char: Char | number) {
        if (typeof char === "number") {
            return this.code === char;
        }
        return this.code === char.code;
    }

    get<Type extends TypeName>(prop: UniProp<Type>): UniValue<Type> | undefined;
    get<Type extends TypeName>(type: Type, name: string): UniValue<Type> | undefined;
    get(...args: [UniProp<any>] | [TypeName, string]) {
        const prop = args.length === 1 ? args[0] : this.root.prop(args[0], args[1]);
        return this._vals.get(prop);
    }
    has(name: string) {
        const maybeProp = this.root.prop(name);
        if (!maybeProp) {
            return false;
        }
        return this._vals.has(maybeProp);
    }

    toString() {
        const parts = [this.label, this.title, this.example].filter(Boolean).join(" ");
        return parts;
    }
}
