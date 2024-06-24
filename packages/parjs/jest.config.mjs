import common from "../../jest.root.mjs";

/** @type {import("jest").Config} */
const config = {
    rootDir: ".",
    setupFilesAfterEnv: ["<rootDir>/spec/utilities/index.ts"],
    ...common
};

export default config;
