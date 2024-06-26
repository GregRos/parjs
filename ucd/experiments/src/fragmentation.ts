import { unicodeGraph } from "./graph.js";
type Range = {
    range: [number, number];
    hRange: [string, string];
    empty: boolean;
};
const ranges: Range[] = [];
let currentRange: Range = { range: [0, 0], hRange: ["0000", "0000"], empty: false };
const LAST_ASSIGNED = 0xe01ef;
for (let i = 0; i <= LAST_ASSIGNED; i++) {
    if (unicodeGraph.codepoints.has(i)) {
        if (currentRange.empty) {
            currentRange.range[1] = i - 1;
            currentRange.hRange[1] = (i - 1).toString(16).toUpperCase();
            ranges.push(currentRange);
            currentRange = {
                range: [i, i],
                hRange: [i.toString(16).toUpperCase(), i.toString(16).toUpperCase()],
                empty: false
            };
        }
    } else {
        if (!currentRange.empty) {
            currentRange.range[1] = i - 1;
            currentRange.hRange[1] = (i - 1).toString(16).toUpperCase();
            ranges.push(currentRange);
            currentRange = {
                range: [i, i],
                hRange: [i.toString(16).toUpperCase(), i.toString(16).toUpperCase()],
                empty: true
            };
        }
    }
}
currentRange.range[1] = 0xe01ef;
currentRange.hRange[1] = "E01EF";
ranges.push(currentRange);
const stuffs = ranges.map(
    x => `${x.empty ? "❌" : "✅"} ${x.hRange[0]}..${x.hRange[1]} [${x.range[1] - x.range[0] + 1}]`
);
for (const stuff of stuffs) {
    console.log(stuff);
}
