const path = require("path");

module.exports = {
    root: true,
    extends: [
        "@gregros/eslint-config",
        "plugin:@typescript-eslint/recommended",
        "plugin:jest/recommended"
    ],
    parser: "@typescript-eslint/parser",
    plugins: ["@typescript-eslint", "jest"],
    rules: {
        // 'any' is used in many places to simplify the type system
        "@typescript-eslint/no-explicit-any": "warn",

        "@typescript-eslint/no-namespace": "off",

        // eslint's rule needs to be switched off in favour of the typescript one
        "@typescript-eslint/no-shadow": "error",
        "no-shadow": "off"
    },

    parserOptions: {
        project: "**/tsconfig.json"
    }
};
