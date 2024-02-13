/**
 * This is a simple yet powerful parser for mathematical expressions meant to demonstrate the power of Parjs.
 * It takes in a string such as:
 *      1 + 3 * 2
 * And outputs an AST such as:
 *      +(1, *(3, 2))
 * It can then evaluate the AST to get the result.
 * Some important features:
 *  1. Supports floating point numbers
 *  2. Maintains precedence and order of operations
 *  3. Maintains associativity
 *  4. Allows the use of parentheses
 *  5. Implemented as a recursive descent parser, which works well for simple
 *     grammars such as this one. Each level of precedence is implemented as a
 *     separate parser.
 *  6. Easily extendable by the addition of custom functions, variables, and more operators.
 */
import type { Parjser } from "../lib";
import { float, string } from "../lib";
import type { DelayedParjser } from "../lib/combinators";
import { between, later, many, map, or, then, thenq } from "../lib/combinators";

export interface Expression {
    calculate(): number;
}

export class NumberLiteral implements Expression {
    constructor(public value: number) {}
    calculate(): number {
        return this.value;
    }
}

export class UnaryOperation implements Expression {
    constructor(
        public operator: "-",
        public value: Expression,
        public name: string = "negation"
    ) {}
    calculate(): number {
        const value = this.value.calculate();
        switch (this.operator) {
            case "-":
                return -value;
            default:
                this.operator satisfies never;
                throw new Error(`Unknown operator '${this.operator}'`);
        }
    }
}

export class BinaryOperation implements Expression {
    constructor(
        public lhs: Expression,
        public operator: "+" | "-" | "*" | "/" | "%",
        public rhs: Expression
    ) {}
    calculate(): number {
        const lhs = this.lhs.calculate();
        const rhs = this.rhs.calculate();
        switch (this.operator) {
            case "+":
                return lhs + rhs;
            case "-":
                return lhs - rhs;
            case "*":
                return lhs * rhs;
            case "/":
                return lhs / rhs;
            case "%":
                return lhs % rhs;
            default:
                this.operator satisfies never;
                throw new Error(`Unknown operator '${this.operator}'`);
        }
    }
}

// Implement the parser as a recursive descent parser.
// In this implementation, each level of precedence is a separate parser.
// For this to work, each parser may only call the next parser higher in precedence.
// To see what this does, see the tests in src/test/examples/math.spec.ts.
//
// https://en.wikipedia.org/wiki/Recursive_descent_parser
// https://en.wikipedia.org/wiki/Parsing_expression_grammar#Examples

// The `t` ("token") function is a helper that adds optional trailing space to the parser.
function t<T>(parser: Parjser<T>): Parjser<T> {
    return parser.pipe(thenq(string(" ").pipe(many())));
}
export const expression: DelayedParjser<Expression> = later();
export const numberLiteral = t(float({ allowSign: false })).pipe(map(x => new NumberLiteral(x)));
export const value: Parjser<Expression> = t(numberLiteral)
    .pipe(
        or(
            expression
                .pipe(between(t(string("(")), t(string(")"))))
                .expects("an expression in parentheses")
        )
    )
    .expects("value");

export const unary: Parjser<Expression> = t(string("-"))
    .pipe(
        then(value),
        map(([op, val]) => new UnaryOperation(op, val)),
        or(value)
    )
    .expects("a unary expression");

export function product() {
    const operator = t(string("*").pipe(or(string("/"), string("%"))));
    return unary
        .pipe(
            then(operator.pipe(then(unary), many())),
            map(expressions => {
                const [first, rest] = expressions;
                return rest.reduce((lhs, [op, rhs]) => new BinaryOperation(lhs, op, rhs), first);
            })
        )
        .expects("product");
}

export function sum() {
    const operator = t(string("+").pipe(or(string("-"))));
    return product()
        .pipe(
            then(operator.pipe(then(product()), many())),
            map(expressions => {
                const [first, rest] = expressions;
                return rest.reduce((lhs, [op, rhs]) => new BinaryOperation(lhs, op, rhs), first);
            })
        )
        .expects("sum");
}

expression.init(sum().expects("expression"));

export function evaluate(input: string): number {
    const result = expression.parse(input);
    if (result.isOk) {
        return result.value.calculate();
    } else {
        throw new Error(
            `Failed to parse expression '${input}': ${JSON.stringify(result, null, 2)}`
        );
    }
}
