/** @type {import("typedoc").TypeDocOptions} */
module.exports = {
    entryPoints: ["./src/lib/index.ts", "./src/lib/combinators.ts", "./src/lib/internal.ts"],
    out: "docs"
};
