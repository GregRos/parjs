"use strict";
/**
 * This is a simple yet powerful parser for mathematical expressions meant to demonstrate the power of Parjs.
 * It takes in a string such as:
 *      1 + 3 * 2
 * And outputs a AST such as:
 *      +(1, *(3, 2))
 * It can then evaluate the AST to get the result.
 * Some important features:
 *  1. Supports floating point numbers
 *  2. Maintains precedence and order of operations
 *  3. Maintains associativity
 *  4. Allows the use of parentheses
 *  5. Implemented using LR parsing techniques by using user state.
 *  6. Easily extendable by the addition of custom functions, variables, and more operators.
 */
Object.defineProperty(exports, "__esModule", { value: true });
require("../setup");
const index_1 = require("../src/index");
class BinaryOperator {
    constructor(operator, left, right) {
        this.operator = operator;
        this.left = left;
        this.right = right;
        this.kind = "expression";
    }
}
class NumericLiteral {
    constructor(value) {
        this.value = value;
        this.kind = "expression";
    }
}
let operators = [
    { operator: "+", precedence: 1 },
    { operator: "-", precedence: 1 },
    { operator: "*", precedence: 2 },
    { operator: "/", precedence: 2 }
];
/**
 * This function REDUCES a stack of operators using LR techniques for precedence parsing.
 * We don't have an operator precedence component in Parjs so we have to do this ourselves.
 * @param exprs
 * @param precedence
 */
let reduceWithPrecedence = (exprs, precedence) => {
    precedence = precedence == null ? -1 : precedence;
    let lastOperator;
    while ((lastOperator = exprs[exprs.length - 2]) && lastOperator.kind === "operator" && lastOperator.precedence >= precedence) {
        let [lhs, op, rhs] = exprs.slice(exprs.length - 3);
        exprs.length -= 3;
        exprs.push(new BinaryOperator(op.operator, lhs, rhs));
    }
};
//required because we want to create a self-referencing, recursive parser
//pExpr is the final parser.
let _pExpr = null;
let pExpr = index_1.Parjs.late(() => _pExpr);
//we have a built-in floating point parser in Parjs.
let pNumber = index_1.Parjs.float().map(x => new NumericLiteral(x));
//Parentheses
let pLeftParen = index_1.Parjs.string("(");
let pRightParen = index_1.Parjs.string(")");
//An expression between parentheses.
let pParenExpr = pExpr.between(pLeftParen, pRightParen);
//either a numeric literal or an expression between parentheses, (a + b + c).
//We add the expression to the expresion stack instead of returning it.
let pUnit = pNumber.or(pParenExpr).act((result, state) => {
    state.exprs.push(result);
}).between(index_1.Parjs.spaces).q;
//Parses a single operator and adds it to the expression stack.
//Each time an operator is parsed, the expression stack is potentially reduced to create a partial AST.
let pOp = index_1.Parjs.anyCharOf(operators.map(x => x.operator).join()).act((op, state) => {
    let operator = operators.find(o => o.operator === op);
    reduceWithPrecedence(state.exprs, operator.precedence);
    state.exprs.push(Object.assign({}, operator, { kind: "operator" }));
}).q;
//Parses a single expression, which is recursively defined as a sequence of expressions separated by operators.
//Note the call to `isolate` at the end. We need it because this parser can be called to parse an expression inside parentheses
//In that case, each parenthesized expression should have a separate expression stack so we don't reduce unnecessary operators.
//An isolated parser blanks out the user state and then restores it.
_pExpr = pUnit.manySepBy(pOp).map((state) => {
    reduceWithPrecedence(state.exprs);
    let expr = state.exprs[0];
    return expr;
}).isolate;
let result = pExpr.parse("( 1 + 2 ) * 2 * 2+( 3 * 5   ) / 2 / 2 + 0.25", {
    exprs: []
});
let printAst = (ast) => {
    if (ast instanceof BinaryOperator) {
        return `${ast.operator}(${printAst(ast.left)}, ${printAst(ast.right)})`;
    }
    else if (ast instanceof NumericLiteral) {
        return ast.value.toString();
    }
};
let evalAst = (ast) => {
    if (ast instanceof BinaryOperator) {
        let vLeft = evalAst(ast.left);
        let vRight = evalAst(ast.right);
        switch (ast.operator) {
            case "+": return vLeft + vRight;
            case "*": return vLeft * vRight;
            case "-": return vLeft - vRight;
            case "/": return vLeft / vRight;
        }
    }
    else if (ast instanceof NumericLiteral) {
        return ast.value;
    }
};
console.log(printAst(result.value));
console.log(`Equals: ${evalAst(result.value)}`);
//# sourceMappingURL=math.js.map