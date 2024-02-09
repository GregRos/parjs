import path from "path";

/** @type {import("jest").Config} */
const config = {
    setupFilesAfterEnv: [path.join("<rootDir>", "src", "test", "helpers", "jest-setup.ts")],
    testEnvironment: "node",
    testPathIgnorePatterns: ["dist"],
    transform: {
        "^.+\\.tsx?$": ["@swc/jest"]
    },
    rootDir: ".",
    testMatch: ["<rootDir>/src/test/**/*.spec.ts"],
    // Should be set via --coverage option
    collectCoverage: false,
    collectCoverageFrom: ["<rootDir>/src/lib/**/*.ts"],
    coverageDirectory: "<rootDir>/coverage",
    moduleNameMapper: {
        "^@lib/(.*)$": "<rootDir>/src/lib/$1",
        "^@lib$": "<rootDir>/src/lib"
    },

    globals: {
        defaults: {}
    }
};

export default config;
