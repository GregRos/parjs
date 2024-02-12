/** @type {import("prettier").Config} */
module.exports = {
    tabWidth: 4,
    arrowParens: "avoid",
    trailingComma: "none",
    printWidth: 100,
    overrides: [
        {
            files: "*.{json,yml,yaml}",
            options: {
                tabWidth: 2
            }
        }
    ],
    plugins: ["prettier-plugin-organize-imports"]
};
