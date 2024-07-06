import { PUTrie } from "immutable-unicode-trie";
import "./logging.js";

const ranges = [
    [1, 10],
    [50, 1000],
    [5000, 5001],
    [5000, 5002],
    [5001, 5004],
    [10000, 10000],
    [100000, 100000]
] as const;

const amt = PUTrie.fromRanges(ranges);
const ranges2 = [
    [50, 1000],
    [10000, 10000],
    [100000, 100000]
] as const;
for (const [start, end] of ranges2) {
    console.log(`[${start}, ${end}] => ${amt.getBit(start)} ${amt.getBit(end)}`);
}
