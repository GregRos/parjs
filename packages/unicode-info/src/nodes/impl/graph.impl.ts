import { pUnicodeData, Range } from "@unicode-info/parser";
import type { getParsedType } from "parjs/internal";
import { Preszr } from "preszr";
import { Roarr } from "roarr";
import { seq } from "stdseq";
import createCache from "../../cache.js";
import { ConfigurableFetcher, UCD } from "../../fetcher/index.js";
import type { DataFlags, StandardPropNames, TypeName } from "../api/shared.api.js";
import type { UnicodeOptions } from "../unicode-options.js";
import { UniImplChar } from "./char.impl.js";
import {
    pGraphBlocks,
    pGraphDerivedCategories,
    pGraphDerivedCoreProperties,
    pGraphEmojiData,
    pGraphPropertyAliases,
    pGraphPropertyValueAliases,
    pGraphPropList,
    pGraphScriptExtensions,
    pGraphScripts
} from "./parsing/parsers.js";
import { UniImplProp } from "./prop.impl.js";
import { isUnsupportedPropertyName, normalizeString, normalizeToCodepoint } from "./utils.js";

import { UniImplScriptxProp, UniImplScriptxValue } from "./scriptx.impl.js";
import { Codepoint, type UniCharInput } from "./shared.impl.js";
import { UniImplValue, UniImplValueUnion } from "./value.impl.js";

const cache = createCache("graph");
/** Implements {@link UnicodeGraph}. Sort of. */
export class UniImplGraph {
    _charValues?: Map<Codepoint, Map<number, number>> = new Map();
    private _flags: Set<DataFlags>;
    _props: UniImplProp[] = [];
    private _nameToProp: Map<string, number> = new Map();
    private _codeToTitle: Map<Codepoint, string> = new Map();
    private _scriptx!: UniImplScriptxProp;
    private constructor(options: UnicodeOptions<any>) {
        this._flags = new Set(options.dataFlags);
    }
    get scriptx() {
        return this._scriptx;
    }
    get props() {
        return seq(this._props);
    }
    get chars() {
        const self = this;
        return seq(function* () {
            for (const category of self.category.values) {
                if (category instanceof UniImplValueUnion) {
                    continue;
                }
                if (category.is("Cn") || category.is("Co")) {
                    continue;
                }
                for (const char of category) {
                    yield char;
                }
            }
        });
    }

    get levels() {
        return seq(this._flags);
    }

    private static getCacheKey(options: UnicodeOptions<any>) {
        return `${options.version}_${options.dataFlags.join(",")}`;
    }

    static async create(options: UnicodeOptions<any>) {
        if (options.graph?.useCache) {
            const key = this.getCacheKey(options);
            const cached = await cache.get(key);
            if (cached) {
                Roarr.info("Reading graph from file system cache.");
                return preszr.decode(cached);
            }
        }
        const graph = new UniImplGraph(options);
        const fetcher = new ConfigurableFetcher(options.version, options.web);
        const results = await fetcher.fetchParsed({
            [UCD.PropertyAliases]: pGraphPropertyAliases,
            [UCD.Scripts]: pGraphScripts,
            [UCD.UnicodeData]:
                graph.hasDataFlag("char:name") || graph.hasDataFlag("char:prop:val")
                    ? pUnicodeData(graph.hasDataFlag("char:name"))
                    : undefined,
            [UCD.DerivedCoreProperties]: graph.hasDataFlag("props:ucd")
                ? pGraphDerivedCoreProperties
                : undefined,
            [UCD.DerivedGeneralCategory]: pGraphDerivedCategories,
            [UCD.PropertyValueAliases]: pGraphPropertyValueAliases,
            [UCD.EmojiData]: graph.hasDataFlag("props:ucd") ? pGraphEmojiData : undefined,
            [UCD.Blocks]: pGraphBlocks,
            [UCD.PropList]: graph.hasDataFlag("props:ucd") ? pGraphPropList : undefined,
            [UCD.ScriptExtensions]: pGraphScriptExtensions
        });
        const props = [
            ...results[UCD.DerivedCoreProperties],
            ...results[UCD.EmojiData],
            ...results[UCD.PropList],
            results[UCD.Scripts],
            results[UCD.Blocks],
            results[UCD.DerivedGeneralCategory]
        ];
        graph._props = props;
        for (let i = 0; i < props.length; i++) {
            const prop = props[i];
            for (const name of prop.names) {
                graph._setNameToProp(name, i);
            }
            prop.graph = graph;
            prop.key = i;
        }
        const scriptxAliases = new Set(["scx", "Script_Extensions"].map(normalizeString));
        const skipped = new Set<string>();
        for (const propAliasGroup of results[UCD.PropertyAliases].values()) {
            if (isUnsupportedPropertyName(propAliasGroup)) {
                for (const name of propAliasGroup) {
                    skipped.add(name);
                }
                continue;
            }
            const allNames = propAliasGroup.map(normalizeString);
            if (allNames.some(x => scriptxAliases.has(x))) {
                for (const name of allNames) {
                    scriptxAliases.add(name);
                }
                continue;
            }
            const canonicalProp = allNames.map(name => graph.tryProp(name)).find(x => x);
            if (!canonicalProp) {
                Roarr.warn(`Could not find a property for the aliases: ${allNames.join(" ↔ ")}`);
                for (const name of allNames) {
                    skipped.add(name);
                }
                continue;
            }
            graph._registerAliases(canonicalProp.key, ...allNames);
        }
        graph._registerAliases(graph.prop("General_Category", "string").key, "category");
        const gcProp = graph.prop("General_Category", "string");
        // Register union categories
        const singeLetterGroups = gcProp.values
            .map(x => x.shortLabel)
            .groupBy(x => x.slice(0, 1))
            .pull();

        // Register single-letter unions of categories
        for (const [category, values] of singeLetterGroups) {
            gcProp._registerUnion(category, values);
        }
        // There is also this special case union:
        gcProp._registerUnion("LC", ["Ll", "Lt", "Lu"]);
        for (const [name, altEntries] of results[UCD.PropertyValueAliases]) {
            if (isUnsupportedPropertyName(name) || skipped.has(name)) {
                continue;
            }
            const prop = graph.tryProp(name);

            if (!prop) {
                const firstAltValueNames = seq(altEntries)
                    .map(x => seq(x).take(3).strJoin(" ↔ ").pull())
                    .take(3)
                    .strJoin(" | ")
                    .pull();

                Roarr.warn(
                    `Could not find property ${name} to register alt values: ${firstAltValueNames}`
                );
                continue;
            }

            if (prop.type === "boolean") {
                continue;
            }
            if (prop.type !== "string") {
                throw new Error(
                    `Property ${name} is of type ${prop.type}, which isn't supposed to have alt values`
                );
            }
            const property = prop as UniImplProp<"string">;
            const naNames = ["nb", "none", "zzzz"];
            for (const aliases of altEntries) {
                const allNames = seq(aliases).map(normalizeString).toSet().pull();
                if (naNames.some(x => allNames.has(x))) {
                    Roarr.debug(`Ignoring N/A value: ${seq(aliases).strJoin(" ↔ ").pull()}`);
                    continue;
                }
                if (allNames.has("hrkt")) {
                    Roarr.debug(`Ignoring Hiragana_Or_Katanakana`);
                    continue;
                }
                const value = seq(allNames)
                    .map(x => property.tryGetValue(x))
                    .find(x => !!x)
                    .pull();

                if (!value) {
                    throw new Error(
                        `Value not found: ${seq(aliases).take(3).strJoin(" ↔ ").pull()}`
                    );
                }
                property._registerAlias(value, allNames);
            }
        }
        const scriptx = new UniImplScriptxProp(graph.script);
        for (const obj of results[UCD.ScriptExtensions]) {
            scriptx._bindRangesToScripts(obj.scripts, obj.ranges);
        }
        for (const alias of scriptxAliases) {
            scriptx._names.add(alias);
        }
        graph._scriptx = scriptx;
        if (graph.hasDataFlag("char:name") || graph.hasDataFlag("char:prop:val")) {
            graph._loadChars(results[UCD.UnicodeData]);
        }

        await cache.set(this.getCacheKey(options), preszr.encode(graph), 60 * 60 * 1000);
        return graph;
    }

    private _buildCodepointMap(allowedCodepoints: Set<number>) {
        const codepointMap = new Map<number, Map<number, number>>();
        for (const prop of this._props) {
            const propSeqId = prop.key;
            for (const value of prop.values) {
                const valueSeqId = value.localId;
                if (!(value instanceof UniImplValue)) {
                    continue;
                }
                for (const range of value.ranges) {
                    for (const codepoint of range) {
                        if (!allowedCodepoints.has(codepoint)) {
                            continue;
                        }
                        let myMap = codepointMap.get(codepoint);
                        if (!myMap) {
                            myMap = new Map();
                            codepointMap.set(codepoint, myMap);
                        }
                        myMap.set(propSeqId, valueSeqId);
                    }
                }
            }
        }
        return codepointMap;
    }

    private _loadChars(unicodeData: getParsedType<ReturnType<typeof pUnicodeData>>) {
        const graph = this;
        graph._codeToTitle = new Map();
        const codepoints = new Set<number>();
        for (const row of unicodeData) {
            if (graph.hasDataFlag("char:name")) {
                graph._codeToTitle.set(row.codepoint, row.name!);
            }
            codepoints.add(row.codepoint);
        }
        if (graph.hasDataFlag("char:prop:val")) {
            graph._charValues = graph._buildCodepointMap(codepoints);
        }
    }

    hasDataFlag(level: DataFlags) {
        return this._flags.has(level);
    }

    _registerTitle(codepoint: number, title: string) {
        this._codeToTitle.set(codepoint, title);
    }

    get block() {
        return this.prop("Block", "string");
    }
    get category() {
        return this.prop("General_Category", "string");
    }
    get script() {
        return this.prop("Script", "string");
    }

    getPropByTransientId(seqId: number) {
        return this._props[seqId];
    }

    getTransientSeqIdForProp(prop: UniImplProp) {
        return this._props.indexOf(prop);
    }

    tryProp<Type extends TypeName = any>(
        nameOrProp: UniImplProp<Type> | string
    ): UniImplProp<Type> | undefined {
        if (nameOrProp instanceof UniImplProp) {
            return nameOrProp;
        }
        nameOrProp = normalizeString(nameOrProp);
        const seqId = this._nameToProp.get(nameOrProp);
        if (seqId === undefined) {
            return undefined;
        }
        return this.getPropByTransientId(seqId);
    }

    prop<Type extends TypeName>(prop: UniImplProp<Type>): UniImplProp<Type>;
    prop(name: StandardPropNames): UniImplProp<"string">;
    prop<Type extends TypeName>(name: string, type?: Type): UniImplProp<Type>;
    prop(name: string | UniImplProp, type?: TypeName) {
        if (typeof name !== "string") {
            if (name instanceof UniImplProp) {
                var prop: UniImplProp | undefined = name;
            } else {
                throw new Error(`Expected a name or UniProp object, got ${name}`);
            }
        } else {
            var prop = this.tryProp(name);
        }
        if (!prop) {
            throw new Error(`Property not found: ${name}`);
        }
        if (type && prop.type !== type) {
            throw new Error(`Property ${name} is of type ${prop.type}, expected ${type}`);
        }
        return prop;
    }

    private _makeChar(code: UniCharInput) {
        code = normalizeToCodepoint(code);
        return new UniImplChar(code, this, this._codeToTitle.get(code));
    }
    char(code: UniCharInput) {
        const chr = this._makeChar(code);
        return chr;
    }

    _registerAliases(to: number, ...aliases: string[]) {
        for (const alias of aliases) {
            this._setNameToProp(alias, to);
        }
        const prop = this.getPropByTransientId(to);
        for (const alias of aliases) {
            prop._names.add(alias);
        }
    }

    private _setNameToProp(name: string, prop: number) {
        this._nameToProp.set(normalizeString(name), prop);
    }
}
const preszr = Preszr({
    encodes: [
        UniImplGraph,
        UniImplProp,
        UniImplValue,
        UniImplChar,
        UniImplValueUnion,
        UniImplScriptxProp,
        Range,
        UniImplScriptxValue
    ]
});
