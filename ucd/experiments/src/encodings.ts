import { readFileSync, writeFileSync } from "fs";

const b64 = readFileSync("./trie.bin").toString("base64");
writeFileSync("./trie.b64", b64);
