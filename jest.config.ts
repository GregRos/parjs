import type { Config } from "jest";
import path from "path";

const config: Config = {
    setupFilesAfterEnv: [path.join(__dirname, "src", "test", "helpers", "jest-setup.ts")],
    testPathIgnorePatterns: ["dist"],
    transform: {
        // @swc-jest is used because the default ts-jest transformer can be slow
        "^.+\\.(t|j)sx?$": "@swc/jest"
    }
};

export default config;
