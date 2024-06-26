import { Fetcher, UCD } from "@unimatch/fetcher";
import {
    NoScript,
    Range,
    UniBlock,
    UniCategory,
    UniRangePropValue,
    UniScript
} from "@unimatch/parser";
import assert from "assert";
import { Preszr } from "preszr";
import { Roarr } from "roarr";
import { seqs } from "stdseq";
import graphCache from "../graph/cache.js";
import { Codepoint, Combination, Combinations } from "../graph/index.js";

const preszr = Preszr({
    encodes: [
        UniBlock,
        UniCategory,
        Range,
        Combinations,
        UniScript,
        Codepoint,
        UniRangePropValue
    ].map(x => ({
        version: 7,
        encodes: x
    }))
});

export interface Graph {
    codepoints: Map<number, Codepoint>;
    combinations: Combinations;
    blocks: UniBlock[];
    scripts: UniScript[];
    categories: UniCategory[];
}

declare module "@unimatch/parser" {
    interface UniRangePropValue<T> {
        codepoints: Map<number, Codepoint>;
    }
}

export class GraphBuilder {
    _fetcher = Fetcher;

    private async _build(): Promise<Graph> {
        Roarr.info("Building graph");
        const [blocks, scripts, categories, unicodeData, propValueAliases, propAliases] =
            await Promise.all([
                this._fetcher.fetchParsed(UCD.Blocks),
                this._fetcher.fetchParsed(UCD.Scripts),
                this._fetcher.fetchParsed(UCD.DerivedGeneralCategory),
                this._fetcher.fetchParsed(UCD.UnicodeData),
                this._fetcher.fetchParsed(UCD.PropertyValueAliases),
                this._fetcher.fetchParsed(UCD.PropertyAliases)
            ]);
        const codepoints = new Map<number, Codepoint>();
        const start = Date.now();
        Roarr.info("Building graph");
        const combos = new Map<string, Combination>();
        let i = 0;
        let stateRangeStart: (typeof unicodeData)[0] | null = null;
        console.log("Total codepoints", unicodeData.length);
        for (const codepoint of unicodeData) {
            const block = blocks.find(block => block.contains(codepoint.codepoint))!;
            const script = scripts.find(script => script.contains(codepoint.codepoint));
            const category = categories.find(category => category.value === codepoint.category)!;

            const comboKey = [script?.value ?? -1, block.value, category.value].join(",");
            let combo = combos.get(comboKey);
            if (!combo) {
                combo = new Combination(i++, script ?? NoScript, block, category);
                combos.set(comboKey, combo);
            }
            if (codepoint.name.includes("Private Use")) {
                continue;
            }
            if (codepoint.name.includes(", First")) {
                // This is a range, we need to generate the characters ourselves
                stateRangeStart = codepoint;
                continue;
            }
            if (codepoint.name.includes(", Last")) {
                if (!stateRangeStart) {
                    throw new Error("Invalid state, expected range start");
                }
                // Get rid of start, end < >
                let name = stateRangeStart.name.slice(1, -1);
                // Get rid of the ", Last" part
                name = name.split(", ")[0];
                name = name.toUpperCase();
                for (const cp of seqs.range(stateRangeStart.codepoint, codepoint.codepoint)) {
                    const formatedName = `${name}-${cp.toString(16).toUpperCase()}`;
                    const codepointObj = new Codepoint(cp, formatedName, combos.get(comboKey)!);
                    codepoints.set(cp, codepointObj);
                }
                stateRangeStart = null;
                block.codepoints.set(codepoint.codepoint, codepoints.get(codepoint.codepoint)!);
                script?.codepoints.set(codepoint.codepoint, codepoints.get(codepoint.codepoint)!);
                category.codepoints.set(codepoint.codepoint, codepoints.get(codepoint.codepoint)!);
                continue;
            }
            assert(!stateRangeStart);

            const codepointObj = new Codepoint(
                codepoint.codepoint,
                codepoint.name,
                combos.get(comboKey)!
            );
            block.codepoints.set(codepoint.codepoint, codepointObj);
            script?.codepoints.set(codepoint.codepoint, codepoints.get(codepoint.codepoint)!);
            category.codepoints.set(codepoint.codepoint, codepoints.get(codepoint.codepoint)!);
            codepoints.set(codepoint.codepoint, codepointObj);
        }

        Roarr.info({ duration: Date.now() - start }, "Built graph");
        // Derived categories:
        for (const propAlias of propAliases) {
        }
        return {
            codepoints,
            blocks,
            scripts,
            categories,
            combinations: new Combinations([...combos.values()])
        };
    }

    private async _dump(graph: Graph) {
        const start = Date.now();
        const encoded = preszr.encode(graph);
        await graphCache.set("ucd", encoded, 60 * 60 * 24 * 1000);
        Roarr.info({ duration: Date.now() - start }, "Dumped graph");
    }

    async load(useCache = true): Promise<Graph> {
        const encoded = await graphCache.get("ucd");
        try {
            if (encoded && useCache) {
                Roarr.info("Returning cached graph");
                const start = Date.now();
                const result = preszr.decode(encoded);
                Roarr.info({ duration: Date.now() - start }, "Decoded graph");
                return result;
            }
        } catch (e: any) {
            Roarr.error(e, `Failed to decode cache: ${e.message}`);
        }
        Roarr.info("No cache found! Building graph");
        const graph = await this._build();
        await this._dump(graph);
        return graph;
    }
}
