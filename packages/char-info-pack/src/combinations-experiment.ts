import { unicodeInfo, type UnicodeCharacter } from "unicode-info";
function getBitLength(value: number) {
    return Math.floor(Math.log2(value) + 1);
}
const graph = await unicodeInfo({
    version: "15.1.0",
    dataFlags: ["char:name", "char:prop:val", "props:ucd", "props:emoji"],
    web: { cache: "extended" }
});

const maxValueKeyBitLength = graph.props
    .concatMap(x => x.values)
    .map(x => x.key)
    .map(getBitLength)
    .maxBy(x => x)
    .map(x => BigInt(x!));

function getBigIntPropertyVector(char: UnicodeCharacter) {
    let vector = 0n;
    const shift = maxValueKeyBitLength.pull()!;
    for (const val of char.values) {
        vector |= (vector << shift) | BigInt(val.key);
    }
    return vector;
}

console.log(graph.chars.count().pull());
const combinations = graph.chars.map(getBigIntPropertyVector).uniq().cache();
console.log(combinations.toArray().pull());
let bitLength = 0;
for (const prop of graph.props) {
    const count = prop.values.count().pull();
    console.log(`${prop.longName}: ${getBitLength(count)} (${count})`);
    bitLength += getBitLength(count);
}
console.log(`Max bit length: ${bitLength}`);
