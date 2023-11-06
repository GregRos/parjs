const path = require("path");

module.exports = {
    root: true,
    extends: ["@gregros/eslint-config", "plugin:@typescript-eslint/recommended"],
    parser: "@typescript-eslint/parser",
    plugins: ["@typescript-eslint"],
    rules: {
        // 'any' is used in many places to simplify the type system
        "@typescript-eslint/no-explicit-any": "warn",

        "@typescript-eslint/no-namespace": "off",

        // eslint's rule needs to be switched off in favour of the typescript one
        "@typescript-eslint/no-shadow": "error",
        "no-shadow": "off"
    },

    parserOptions: {
        project: path.join(__dirname, "tsconfig.json")
    }
};
