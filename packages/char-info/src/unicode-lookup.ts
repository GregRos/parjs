/** @external */ /* tslint:disable:naming-convention */

import type { Interval } from "node-interval-tree";
import DataIntervalTree from "node-interval-tree";

import blocks from "./data/block.ranges";
import categories from "./data/category.ranges";
import scripts from "./data/script.ranges";

export interface UnicodeCharGroup {
    name: string;
    alias?: string;
    intervals: Interval[];
    displayName: string;
}

export interface UnicodeLookup {
    allBlocks: DataIntervalTree<UnicodeCharGroup>;
    allCategories: DataIntervalTree<UnicodeCharGroup>;
    allScripts: DataIntervalTree<UnicodeCharGroup>;
    blocks: Map<string, UnicodeCharGroup>;
    categories: Map<string, UnicodeCharGroup>;
    scripts: Map<string, UnicodeCharGroup>;
    longCategoryToCode: Map<string, string>;
}

function homogenizeRawStr(str: string) {
    return str.toLowerCase().replace(/_/g, "");
}

const rangeRegex = /(\\\w[0-9a-fA-F]+|[\s\S])(?:-(\\\w[0-9a-fA-F]+|[\s\S]))?/g;

function getCharCode(str: string) {
    if (str.length === 1) {
        return str.charCodeAt(0);
    }
    const hex = str.slice(2);
    return Number.parseInt(hex, 16);
}

function expandIntoRanges(compressedForm: string) {
    const matches = [];
    let x = null;
    while ((x = rangeRegex.exec(compressedForm))) {
        matches.push([x[1], x[2] || x[1]]);
    }
    const ranges = [];

    for (const match of matches) {
        const start = getCharCode(match[0]);
        const end = getCharCode(match[1]);
        ranges.push({
            low: start,
            high: end
        } as Interval);
    }
    ranges.sort((a, b) => a.low - b.low);
    return ranges;
}

type RawUnicodeName = string | [string, string];

type RawUnicodeRecord = [RawUnicodeName, string];

function expandRawRecord(raw: RawUnicodeRecord) {
    let name: string;
    let alias: string | undefined = undefined;
    const fst = raw[0];
    if (fst.constructor === Array) {
        name = fst[0];
        alias = fst[1];
    } else {
        name = fst as string;
    }
    return {
        name,
        alias,
        intervals: expandIntoRanges(raw[1]),
        get displayName() {
            return this.alias || this.name;
        }
    } as UnicodeCharGroup;
}

function buildLookup() {
    const lookup: UnicodeLookup = {
        allBlocks: new DataIntervalTree<UnicodeCharGroup>(),
        allCategories: new DataIntervalTree<UnicodeCharGroup>(),
        allScripts: new DataIntervalTree<UnicodeCharGroup>(),
        blocks: new Map(),
        categories: new Map(),
        scripts: new Map(),
        longCategoryToCode: new Map()
    };
    for (const rawBlock of blocks) {
        const block = expandRawRecord(rawBlock as RawUnicodeRecord);
        lookup.blocks.set(homogenizeRawStr(block.name), block);
        for (const interval of block.intervals) {
            lookup.allBlocks.insert(interval.low, interval.high, block);
        }
    }
    for (const rawCategory of categories) {
        const cat = expandRawRecord(rawCategory as RawUnicodeRecord);
        const hName = homogenizeRawStr(cat.name);
        lookup.categories.set(hName, cat);
        lookup.longCategoryToCode.set(homogenizeRawStr(cat.alias!), hName);
        for (const interval of cat.intervals) {
            lookup.allCategories.insert(interval.low, interval.high, cat);
        }
    }
    for (const rawScript of scripts) {
        const script = expandRawRecord(rawScript as RawUnicodeRecord);
        lookup.scripts.set(homogenizeRawStr(script.name), script);
        for (const interval of script.intervals) {
            lookup.allScripts.insert(interval.low, interval.high, script);
        }
    }
    return lookup;
}

export const lookup = buildLookup();
