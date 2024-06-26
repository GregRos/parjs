import {
    pBlocks,
    pDerivedCoreProperties,
    pDerivedGeneralCategory,
    pEmojiData,
    pPropertyAliases,
    pPropertyValueAliases,
    pScripts,
    type Range
} from "@unimatch/parser";
import { map } from "parjs/combinators";
import { seq, type Seq } from "stdseq";
import { consolidate } from "./generic-consolidate.js";
import { UniProp } from "./nodes/graph.impl.js";
const consolidateProps = (rows: Seq<{ name: string; value?: any; ranges: Range[] }>) => {
    const props = new Map<string, UniProp>();
    for (const row of rows) {
        let existing = props.get(row.name);
        if (!existing) {
            existing = new UniProp(typeof row.value as any, row.name);
            props.set(row.name, existing);
        }
        existing._registerValue(row.value ?? true, row.ranges);
    }
    return seq(props.values());
};

const consolidateProp =
    (name: string) => (rows: Iterable<{ name: string; value?: any; ranges: Range[] }>) => {
        let prop: UniProp | undefined;
        for (const row of rows) {
            if (!prop) {
                prop = new UniProp(typeof row.value as any, name);
            }
            prop._registerValue(row.value ?? true, row.ranges);
        }
        return prop!;
    };
export const pGraphBlocks = pBlocks.pipe(
    map(blocks => {
        const Block = new UniProp("string", "Block");
        for (const block of blocks) {
            Block._registerValue(block.name, [block.range]);
        }
        return Block;
    })
);

export const pGraphDerivedCoreProperties = pDerivedCoreProperties.pipe(
    map(consolidate),
    map(consolidateProps)
);

export const pGraphScripts = pScripts.pipe(map(consolidate), map(consolidateProp("Script")));

export const pGraphEmojiData = pEmojiData.pipe(map(consolidate), map(consolidateProps));

export const pGraphDerivedCategories = pDerivedGeneralCategory.pipe(
    map(consolidate),
    map(consolidateProp("Category"))
);

export const pGraphPropertyAliases = pPropertyAliases.pipe(
    map(aliases => {
        const consolidated = new Map<string, { shortName: string; longNames: string[] }>();
        for (const { shortName, longName } of aliases) {
            if (!consolidated.has(shortName)) {
                consolidated.set(shortName, { shortName, longNames: [] });
            }
            consolidated.get(shortName)!.longNames.push(longName);
        }
        return consolidated;
    })
);

export const pGraphPropertyValueAliases = pPropertyValueAliases.pipe(
    map(aliases => {
        const consolidated = new Map<
            string,
            {
                name: string;
                valueAlts: Map<
                    string,
                    {
                        shortValue: string;
                        longValues: string[];
                    }
                >;
            }
        >();
        for (const { type, shortValue, longValue } of aliases) {
            let current = consolidated.get(type);
            if (!current) {
                current = {
                    name: type,
                    valueAlts: new Map()
                };
                consolidated.set(type, current);
            }
            let valueAliases = current.valueAlts.get(shortValue);
            if (!valueAliases) {
                valueAliases = {
                    shortValue,
                    longValues: []
                };
                current.valueAlts.set(shortValue, valueAliases);
            }
            valueAliases.longValues.push(longValue);
        }
        return consolidated;
    })
);
