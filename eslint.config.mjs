import js from "@eslint/js";
import stylistic from "@stylistic/eslint-plugin";
import typescript from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import markdown from "eslint-plugin-markdown";
/** @type {import("eslint").Linter.Config[]} */
export default [
    {
        ignores: [".obsidian", ".git", "node_modules", "dist", "coverage", ".husky", "typedoc"]
    },
    {
        files: ["*.md"],
        processor: markdown.processors.markdown
    },
    {
        // Run exclusively on TS/JS code blocks
        files: ["**/*.md/*.{ts,js,tsx}"],
        plugins: { stylistic },
        languageOptions: {
            parser: tsParser,

            sourceType: "module",
            ecmaVersion: "latest"
        },

        rules: {
            "stylistic/indent": ["error", 4],
            "stylistic/no-tabs": "error",
            "stylistic/object-curly-spacing": ["error", "always"],
            "stylistic/semi": ["error", "never"],
            "no-extra-semi": "error",
            "no-multi-spaces": "error",
            "space-infix-ops": "error",
            "comma-spacing": ["error", { before: false, after: true }],
            "keyword-spacing": ["error", { before: true, after: true }],

            "object-curly-newline": "off",
            "object-property-newline": "off",
            "array-element-newline": "off",
            "newline-per-chained-call": "off",
            "operator-linebreak": "off",
            "max-len": "off"
        }
    },
    {
        // Run exclusively on normal TS/JS files.
        files: ["**/*.{ts,tsx}"],
        ignores: ["**/*.md/*.{ts,js,tsx}"],
        plugins: { ts: typescript },

        languageOptions: {
            parser: tsParser,
            sourceType: "module",
            ecmaVersion: "latest",
            parserOptions: {
                projectService: true
            }
        },
        rules: {
            ...js.configs.recommended.rules,

            //! UNSORTED RULES
            // Place any additional rules either here at the top, or in the appropriate section below.
            "ts/consistent-type-imports": "error",
            "ts/consistent-type-exports": "error",

            //! Disable formatting rules since we're using prettier.
            quotes: "off",
            "no-undef": "off",
            "no-case-declarations": "off",
            "no-trailing-spaces": "off",
            //! END

            //! These are from https://github.com/google/gts/blob/main/.eslintrc.json
            "prefer-const": "error",
            "eol-last": "error",
            "prefer-arrow-callback": "error",
            "no-restricted-properties": [
                "error",
                {
                    object: "describe",
                    property: "only"
                },
                {
                    object: "it",
                    property: "only"
                }
            ],
            //! END

            //! These are from https://github.com/google/eslint-config-google/blob/master/index.js
            "guard-for-in": "error",
            "no-caller": "error",
            "no-extend-native": "error",
            "no-extra-bind": "error",
            "no-invalid-this": "error",
            "no-multi-spaces": "error",
            "no-multi-str": "error",
            "no-new-wrappers": "error",
            "prefer-promise-reject-errors": "error",
            //! END

            //! Extra rules
            // Force === except for the special case ==null.
            eqeqeq: ["error", "always", { null: "ignore" }],
            "array-callback-return": "warn",
            "no-self-compare": "warn",
            "dot-notation": "error",
            "max-depth": "warn",
            "max-nested-callbacks": ["warn", 5],

            "max-params": ["warn", 4],

            "no-iterator": "error",

            "no-new": "warn",

            "no-new-object": "error",

            "no-proto": "error",

            "no-sequences": "warn",

            "no-unneeded-ternary": "error",

            "no-useless-computed-key": "error",

            "no-useless-rename": "error",

            "prefer-numeric-literals": "error",

            "symbol-description": "error",
            //! END

            //! These are part of ts/recommended
            // Some have JS versions that need to be disabled.
            "default-param-last": "off",
            "ts/default-param-last": "error",

            "no-redeclare": "off",
            "no-dupe-class-members": "off",
            "ts/no-dupe-class-members": "error",

            "no-duplicate-imports": "off",

            "no-loss-of-precision": "off",
            "ts/no-loss-of-precision": "error",

            "no-throw-literal": "off",
            "ts/no-throw-literal": "error",

            "no-unused-expressions": "off",
            "ts/no-unused-expressions": "error",

            "no-unused-vars": "off",
            "ts/no-unused-vars": ["warn", { args: "none", vars: "local" }],

            "no-useless-constructor": "off",
            "ts/no-useless-constructor": "error",

            "ts/adjacent-overload-signatures": "error",

            "ts/await-thenable": "error",

            "ts/ban-ts-comment": "error",

            "ts/no-extra-non-null-assertion": "error",

            "ts/no-floating-promises": "warn",

            "ts/no-for-in-array": "warn",

            "ts/no-misused-new": "warn",

            "ts/no-misused-promises": "warn",

            "ts/no-namespace": "off",

            "ts/no-non-null-asserted-optional-chain": "warn",

            "ts/prefer-namespace-keyword": "error",

            "ts/triple-slash-reference": "warn",

            //! These aren't part of ts/recommended
            "ts/array-type": [
                "error",
                {
                    default: "array"
                }
            ],

            "ts/consistent-type-assertions": [
                "error",
                {
                    assertionStyle: "as"
                }
            ],

            "ts/no-confusing-non-null-assertion": "error",

            "ts/no-unnecessary-boolean-literal-compare": "error",

            "ts/no-unnecessary-qualifier": "error",
            "ts/prefer-for-of": "warn",
            "ts/prefer-optional-chain": "warn",
            "ts/promise-function-async": "warn"
        }
    }
];
