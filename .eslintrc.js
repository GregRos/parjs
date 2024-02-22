// @ts-check

/** @type {import("@typescript-eslint/utils/dist/ts-eslint/Linter").Linter.Config} c */
const config = {
    root: true,
    extends: [
        "@gregros/eslint-config",
        "plugin:@typescript-eslint/recommended",
        "plugin:jest/recommended"
    ],
    parser: "@typescript-eslint/parser",
    plugins: ["@typescript-eslint", "jest", "eslint-plugin-parjs"],
    rules: {
        "@typescript-eslint/no-explicit-any": "error",
        "@typescript-eslint/no-namespace": "error",

        // eslint's rule needs to be switched off in favour of the typescript one
        "@typescript-eslint/no-shadow": "error",
        "no-shadow": "off",
        "@typescript-eslint/consistent-type-imports": "error",
        "@typescript-eslint/consistent-type-exports": "error",
        "parjs/no-debug-method": "error"
    },

    parserOptions: {
        project: "**/tsconfig.json"
    }
};
module.exports = config;
