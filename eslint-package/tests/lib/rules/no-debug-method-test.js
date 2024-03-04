// https://eslint.org/docs/latest/extend/custom-rule-tutorial#step-6-write-the-test
const { RuleTester } = require("eslint");
const fooBarRule = require("../../../lib/rules/no-debug-method");

const ruleTester = new RuleTester({
    // Must use at least ecmaVersion 2015 because
    // that's when `const` variables were introduced.
    parserOptions: { ecmaVersion: 2015 }
});

// Throws error if the tests in ruleTester.run() do not pass
ruleTester.run(
    "enforce-foo-bar", // rule name
    fooBarRule, // rule code
    {
        // checks
        // 'valid' checks cases that should pass
        valid: [
            {
                code: "const parser = string('abc')"
            }
        ],
        // 'invalid' checks cases that should not pass
        invalid: [
            {
                code: "const parser = string('abc').debug()",
                errors: 1
            }
        ]
    }
);

console.log("All tests passed!");
