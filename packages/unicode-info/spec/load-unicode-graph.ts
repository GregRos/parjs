import { unicodeInfo } from "@lib/nodes/index.js";

export const graph = await unicodeInfo({
    version: "15.1.0",
    dataFlags: ["char:name", "char:prop:val", "props:ucd"],
    graph: {
        useCache: true
    },
    web: {
        cache: "default",
        noFetch: false
    }
});
