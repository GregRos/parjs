import common from "../../../jest.root.mjs";

/** @type {import("jest").Config} */
const config = {
    rootDir: ".",
    setupFilesAfterEnv: ["<rootDir>/../spec/utilities/index.ts"],
    ...common,
    moduleNameMapper: {
        "^@lib/(.*)$": "<rootDir>/../src/$1",
        "^@lib$": "<rootDir>/../src",
        "^@examples/(.*)$": "<rootDir>/$1",
        "^@examples$": "<rootDir>"
    }
};

export default config;
