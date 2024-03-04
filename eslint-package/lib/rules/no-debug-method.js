/** @type {import("eslint").Rule.RuleModule} */
const ruleModule = {
    meta: {
        type: "problem",
        docs: {
            description: "disallow the use of the .debug() method"
        },
        fixable: "code",

        messages: {
            "no-debug-method":
                "The .debug() method should be used for debugging only, and should not be present in production code."
        },
        schema: []
    },
    create(context) {
        return {
            CallExpression(node) {
                if (
                    node.callee.type === "MemberExpression" &&
                    node.callee.property.type === "Identifier" &&
                    node.callee.property.name === "debug"
                ) {
                    context.report({
                        node,
                        messageId: "no-debug-method"
                    });
                }
            }
        };
    }
};

module.exports = ruleModule;
