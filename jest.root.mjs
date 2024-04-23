/** @type {import("jest").Config} */
const common = {
    moduleNameMapper: {
        "^@lib/(.*)$": "<rootDir>/lib/$1",
        "^@lib$": "<rootDir>/lib"
    },
    transform: {
        "^.+\\.tsx?$": [
            "ts-jest",
            {
                tsconfig: "<rootDir>/test/tsconfig.json",
                transpileOnly: true
            }
        ]
    },
    testEnvironment: "node",
    testMatch: ["<rootDir>/test/**/*.test.ts"],
    collectCoverageFrom: ["<rootDir>/lib/**/*.ts"],
    coverageDirectory: "./coverage",
    collectCoverage: false
}

export default common
