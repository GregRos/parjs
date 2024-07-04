import {
    pBlocks,
    pDerivedCoreProperties,
    pDerivedGeneralCategory,
    pEmojiData,
    pPropertyAliases,
    pPropertyValueAliases,
    pPropList,
    pScriptExtensions,
    pScripts,
    type Range
} from "@unicode-info/parser";
import { map } from "parjs/combinators";
import { seq, type Seq } from "stdseq";
import { UniImplProp } from "../prop.impl.js";
import { normalizeString } from "../utils.js";
import { consolidate } from "./generic-consolidate.js";
const consolidateProps = (rows: Seq<{ name: string; value?: any; ranges: Range[] }>) => {
    const props = new Map<string, UniImplProp>();
    let seqId = 0;
    for (const row of rows) {
        let existing = props.get(row.name);
        if (!existing) {
            existing = new UniImplProp(row.value, row.name);
            props.set(row.name, existing);
        }
        existing._registerValue(row.value ?? true, row.ranges);
    }
    const vals = Array.from(props.values());
    return seq(vals);
};

const consolidateProp =
    (name: string) => (rows: Iterable<{ name: string; value?: any; ranges: Range[] }>) => {
        let prop: UniImplProp | undefined;
        for (const row of rows) {
            if (!prop) {
                prop = new UniImplProp(row.name, name);
            }
            prop._registerValue(row.name ?? true, row.ranges);
        }
        return prop!;
    };
export const pGraphBlocks = pBlocks.pipe(
    map(blocks => {
        const Block = new UniImplProp("string", "Block");
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
export const pGraphPropList = pPropList.pipe(map(consolidate), map(consolidateProps));
export const pGraphEmojiData = pEmojiData.pipe(map(consolidate), map(consolidateProps));

export const pGraphDerivedCategories = pDerivedGeneralCategory.pipe(
    map(consolidate),
    map(consolidateProp("General_Category"))
);

export const pGraphPropertyAliases = pPropertyAliases.pipe(
    map(aliases => {
        const consolidated = new Map<string, Set<string>>();
        for (let names of aliases) {
            names = names.map(normalizeString) as [string, string];
            let existing = names.map(n => consolidated.get(n)).find(x => x);
            if (!existing) {
                existing = new Set<string>(names);
            }
            for (const name of names) {
                consolidated.set(name, existing);
            }
        }
        return seq(consolidated.values())
            .map(x => [...x])
            .uniq()
            .pull();
    })
);

export const pGraphPropertyValueAliases = pPropertyValueAliases.pipe(
    map(aliases => {
        const consolidated = new Map<
            string,
            {
                name: string;
                valueAlts: Map<string, Set<string>>;
            }
        >();
        for (let { property, values } of aliases) {
            values = values.map(normalizeString);
            property = normalizeString(property);
            let current = consolidated.get(property);
            if (!current) {
                current = {
                    name: property,
                    valueAlts: new Map()
                };
                consolidated.set(property, current);
            }
            let valueRecord = values.map(v => current.valueAlts.get(v)).find(x => x);
            if (!valueRecord) {
                valueRecord = new Set<string>(values);
            }
            for (const v of values) {
                current.valueAlts.set(v, valueRecord);
            }
        }
        const aliasGroups = seq(consolidated)
            .toMap(([k, v]) => {
                return [k, seq(v.valueAlts.values()).uniq().pull()];
            })
            .pull();

        return aliasGroups;
    })
);

export const pGraphScriptExtensions = pScriptExtensions.pipe(
    map(function* (scriptRows) {
        const byExtensionLine = new Map<string, Range[]>();
        for (const row of scriptRows) {
            let existing = byExtensionLine.get(row.scripts);
            if (!existing) {
                existing = [];
                byExtensionLine.set(row.scripts, existing);
            }
            existing.push(row.range);
        }
        for (const [scriptsLine, ranges] of byExtensionLine) {
            const scripts = scriptsLine.split(" ");
            yield {
                scripts,
                ranges
            };
        }
    })
);
