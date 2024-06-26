import { isUpper, uniIsUpper } from "char-info";
import { seq } from "stdseq";

import { timed } from "./setup/measure.js";

import { unicodeGraph } from "./graph.js";

import { writeFileSync } from "node:fs";
import Module from "node:module";
import type { Combination } from "./graph/codepoint.js";
import inflatedTrie from "./parse-trie.js";
const require = Module.createRequire(import.meta.url);

const UnicodeTrieBuilder = require("unicode-trie/builder");

const graph = unicodeGraph;
const codepointArray = Array.from(graph.codepoints.keys());
console.log(graph.codepoints.size);

const letterUpper = graph.categories.find(x => x.is("Lu"))!;
const sampleData = seq(codepointArray)
    .sample(1000000)
    .map(x => String.fromCodePoint(x))
    .toArray()
    .pull();

const builder = new UnicodeTrieBuilder();

for (const [codepoint, o] of graph.codepoints) {
    builder.set(codepoint, o.combination.seqId);
}
const frozen = inflatedTrie;
const buf = builder.toBuffer();
writeFileSync("./trie.bin", buf);
const rx = /\p{Lu}/u;
const results = [] as boolean[];
const combos = [] as Combination[];
function isUpperTrie(char: string[]) {
    for (const c of char) {
        const seqId = frozen.get(c.codePointAt(0)!);
        const combo = graph.combinations.getById(seqId);
    }
}

const results2 = [] as boolean[];
function isUpperRegexp(char: string[]) {
    for (const c of char) {
        results2.push(rx.test(c));
    }
}

function isUpperCharInfo(char: string[]) {
    for (const c of char) {
        uniIsUpper.code(c.codePointAt(0)!);
    }
}

function isUpperToUpper(char: string[]) {
    for (const c of char) {
        c.toLocaleUpperCase() === c;
    }
}

function isUpperCharInfoAscii(char: string[]) {
    for (const c of char) {
        // NOT REPRESENTATIVE
        // This is only for ASCII characters. It's just a baseline.
        isUpper(c);
    }
}

function isUpperAsciiCheck(char: string[]) {
    for (const c of char) {
        // NOT REPRESENTATIVE
        // This is only for ASCII characters. It's just a baseline.
        const result = c >= "A" && c <= "Z";
    }
}

timed(sampleData, isUpperRegexp);
timed(sampleData, isUpperCharInfo);
timed(sampleData, isUpperTrie);
timed(sampleData, isUpperToUpper);
timed(sampleData, isUpperCharInfoAscii);
timed(sampleData, isUpperAsciiCheck);

console.log(`Equate: ${seq(results).equals(results2).pull()}`);
