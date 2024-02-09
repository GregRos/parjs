import {
    BinaryOperation,
    evaluate,
    expression,
    NumberLiteral,
    product,
    sum,
    unary,
    UnaryOperation,
    value
} from "../../examples/math";

describe("value parser", () => {
    it("can parse 1", () => {
        expect(value.parse("1 ")).toBeSuccessful(new NumberLiteral(1));
    });

    it("can parse an expression in parentheses", () => {
        expect(value.parse("( 1 ) ")).toBeSuccessful(new NumberLiteral(1));
    });
});

describe("unary parser", () => {
    it("can parse a negation expression", () => {
        const expected = new UnaryOperation("-", new NumberLiteral(1));
        expect(unary.parse("-1 ")).toBeSuccessful(expected);
    });
});

describe("product parser", () => {
    describe("single", () => {
        it("can parse *", () => {
            const expected = new BinaryOperation(new NumberLiteral(1), "*", new NumberLiteral(2));
            expect(product().parse("1 * 2 ")).toBeSuccessful(expected);
        });

        it("can parse /", () => {
            const expected = new BinaryOperation(new NumberLiteral(1), "/", new NumberLiteral(2));
            expect(product().parse("1 / 2 ")).toBeSuccessful(expected);
        });

        it("can parse %", () => {
            const expected = new BinaryOperation(new NumberLiteral(1), "%", new NumberLiteral(2));
            expect(product().parse("1 % 2 ")).toBeSuccessful(expected);
        });
    });

    describe("multiple", () => {
        it("can parse *", () => {
            const expected = new BinaryOperation(
                new BinaryOperation(new NumberLiteral(1), "*", new NumberLiteral(2)),
                "*",
                new NumberLiteral(3)
            );
            expect(product().parse("1 * 2     * 3 ")).toBeSuccessful<BinaryOperation>(expected);
        });

        it("can parse /", () => {
            const expected = new BinaryOperation(
                new BinaryOperation(new NumberLiteral(1), "/", new NumberLiteral(2)),
                "/",
                new NumberLiteral(3)
            );
            expect(product().parse("1   /2 / 3  ")).toBeSuccessful(expected);
        });

        it("can parse %", () => {
            const expected = new BinaryOperation(
                new BinaryOperation(new NumberLiteral(1), "%", new NumberLiteral(2)),
                "%",
                new NumberLiteral(3)
            );
            expect(product().parse("1%2%3")).toBeSuccessful(expected);
        });
    });
});

describe("sum parser", () => {
    describe("single", () => {
        it("can parse +", () => {
            const expected = new BinaryOperation(new NumberLiteral(1), "+", new NumberLiteral(2));
            expect(sum().parse("1 + 2 ")).toBeSuccessful(expected);
        });

        it("can parse -", () => {
            const expected = new BinaryOperation(new NumberLiteral(1), "-", new NumberLiteral(2));
            expect(sum().parse("1 - 2 ")).toBeSuccessful(expected);
        });
    });

    describe("multiple", () => {
        it("can parse +", () => {
            const expected = new BinaryOperation(
                new BinaryOperation(new NumberLiteral(1), "+", new NumberLiteral(2)),
                "+",
                new NumberLiteral(3)
            );
            expect(sum().parse("1 + 2 + 3")).toBeSuccessful(expected);
        });

        it("can parse -", () => {
            const expected = new BinaryOperation(
                new BinaryOperation(new NumberLiteral(1), "-", new NumberLiteral(2)),
                "-",
                new NumberLiteral(3)
            );
            expect(sum().parse("1 - 2 - 3 ")).toBeSuccessful(expected);
        });
    });
});

describe("expression parser", () => {
    it("can parse a number", () => {
        expect(expression.parse("1")).toBeSuccessful(new NumberLiteral(1));
    });

    const leftExpression = new BinaryOperation(
        new NumberLiteral(1),
        "+",
        new BinaryOperation(new NumberLiteral(2), "/", new NumberLiteral(3))
    );

    it("can parse a mixed expression of sums and products", () => {
        expect(expression.parse("1+   2/   3")).toBeSuccessful(leftExpression);
    });

    it("can parse 1+2/3-4*5", () => {
        const expected = new BinaryOperation(
            leftExpression,
            "-",
            new BinaryOperation(new NumberLiteral(4), "*", new NumberLiteral(5))
        );
        expect(expression.parse("1+2/  3-4*5")).toBeSuccessful(expected);
    });
});

describe("evaluation", () => {
    it("can evaluate a complex expression", () => {
        expect(evaluate("3+(5*2)-4/2")).toBe(11);
    });

    it("calculates the correct result when parentheses are used", () => {
        expect(evaluate("3+(5*( 2 -4) )/   2")).toBe(-2);
    });

    it("can evaluate %", () => {
        expect(evaluate("3%2")).toBe(1);
    });

    it("can evaluate unary -", () => {
        expect(evaluate("-3")).toBe(-3);
    });

    it("can evaluate unary with the correct precedence", () => {
        expect(evaluate("(-  (3 +-0))*2")).toBe(-6);
    });

    it("can parse a complex expression from the bug report", () => {
        // this expression was reported to fail in the bug report:
        // https://github.com/GregRos/parjs/issues/27
        expect(evaluate("( 1 + 2 ) * 2 * 2+( 3 * 5   ) / 2 / 2 + 0.25")).toBe(16);
    });

    it("displays an error message if the expression is invalid", () => {
        // the different parsers' expectations are combined into a single error
        // message. Without the "expects" calls, the error message would be much
        // more difficult to understand.
        expect(() => evaluate("1 + 2 +")).toThrowErrorMatchingInlineSnapshot(`
            "Failed to parse expression '1 + 2 +': {
              "trace": {
                "userState": {},
                "position": 7,
                "reason": "expecting '-' OR expecting a floating-point number OR expecting '('",
                "input": "1 + 2 +",
                "location": {
                  "line": 0,
                  "column": 7
                },
                "stackTrace": [
                  {
                    "type": "string",
                    "expecting": "expecting '-'"
                  },
                  {
                    "type": "then",
                    "expecting": "expecting '-'"
                  },
                  {
                    "type": "map",
                    "expecting": "expecting '-'"
                  },
                  {
                    "type": "then",
                    "expecting": "expecting '-'"
                  },
                  {
                    "type": "map",
                    "expecting": "expecting '-'"
                  },
                  {
                    "type": "float",
                    "expecting": "expecting a floating-point number"
                  },
                  {
                    "type": "then",
                    "expecting": "expecting a floating-point number"
                  },
                  {
                    "type": "map",
                    "expecting": "expecting a floating-point number"
                  },
                  {
                    "type": "map",
                    "expecting": "expecting a floating-point number"
                  },
                  {
                    "type": "then",
                    "expecting": "expecting a floating-point number"
                  },
                  {
                    "type": "map",
                    "expecting": "expecting a floating-point number"
                  },
                  {
                    "type": "string",
                    "expecting": "expecting '('"
                  },
                  {
                    "type": "then",
                    "expecting": "expecting '('"
                  },
                  {
                    "type": "map",
                    "expecting": "expecting '('"
                  },
                  {
                    "type": "then",
                    "expecting": "expecting '('"
                  },
                  {
                    "type": "map",
                    "expecting": "expecting '('"
                  },
                  {
                    "type": "then",
                    "expecting": "expecting '('"
                  },
                  {
                    "type": "map",
                    "expecting": "an expression in parentheses"
                  },
                  {
                    "type": "or",
                    "expecting": "value"
                  },
                  {
                    "type": "or",
                    "expecting": "a unary expression"
                  },
                  {
                    "type": "then",
                    "expecting": "a unary expression"
                  },
                  {
                    "type": "map",
                    "expecting": "product"
                  },
                  {
                    "type": "then",
                    "expecting": "expecting one of: expecting '-'"
                  },
                  {
                    "type": "many",
                    "expecting": "expecting one of: expecting '-'"
                  },
                  {
                    "type": "then",
                    "expecting": "product"
                  },
                  {
                    "type": "map",
                    "expecting": "expression"
                  },
                  {
                    "type": "later",
                    "expecting": "expression"
                  }
                ],
                "kind": "Hard"
              }
            }"
        `);
    });
});
