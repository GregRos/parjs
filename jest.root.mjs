/** @type {import("jest").Config} */
const common = {
    moduleNameMapper: {
        "^@lib/(.*)$": "<rootDir>/src/$1",
        "^@lib$": "<rootDir>/src"
    },
    transform: {
        "^.+\\.tsx?$": ["@swc/jest"]
    },
    testEnvironment: "node",
    testMatch: ["<rootDir>/spec/**/*.spec.ts"],
    collectCoverageFrom: ["<rootDir>/src/**/*.ts"],
    coverageDirectory: "./coverage",
    collectCoverage: false,
    testPathIgnorePatterns: ["node_modules", "dist"]
};

export default common;
