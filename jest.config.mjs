import path from "path";

/** @type {import("jest").Config} */
const config = {
    automock: false,
    setupFilesAfterEnv: [path.join("<rootDir>", "src", "test", "helpers", "jest-setup.ts")],
    testEnvironment: "node",
    testPathIgnorePatterns: ["dist"],
    transform: {
        "^.+\\.tsx?$": ["ts-jest", {
            transpileOnly: true
        }]
    },
    rootDir: ".",
    testMatch: ["<rootDir>/src/test/**/*.spec.ts"],
    // The default test threshold is 5s. That's way too low.
    slowTestThreshold: 500,

    // Should be set via --coverage option
    collectCoverage: false,
    collectCoverageFrom: ["<rootDir>/src/lib/**/*.ts"],
    coverageDirectory: "<rootDir>/coverage",
    forceExit: true,
    moduleNameMapper: {
        "^@lib/(.*)$": "<rootDir>/src/lib/$1",
        "^@lib$": "<rootDir>/src/lib"
    },

    globals: {
        defaults: {}
    }
};

export default config;
