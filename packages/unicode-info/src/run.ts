import { unicodeInfo } from "./index.js";
import "./logging.js";
const g = await unicodeInfo({
    version: "15.1.0",
    dataFlags: ["char:name", "char:prop:val", "props:ucd", "props:emoji"],
    web: { cache: "extended" },
    graph: {
        useCache: true
    }
});
const arrows = g.block.getValue("Arrows");
for (const arrow of arrows) {
    console.log(arrow.toString());
}

for (const bopo of g.scriptx.scriptsFor("U+3037")) {
    console.log(bopo.toString());
}
