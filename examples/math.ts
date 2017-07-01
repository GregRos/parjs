import {Parjs} from "../src/index";
import _ = require('lodash');
/**
 * This is a heavy-duty parser for mathematical expressions that is meant to demonstrate the power of parjs.
 */

interface Expression {

}

class BinaryOperator {
    constructor(public operator : string, public left : Expression, public right : Expression) {}
}

class FunctionCall {
    constructor(public name : string, public args : Expression[]) {

    }
}

class NumericLiteral {
    constructor(public value : number) {

    }
}

/**
    BinaryOperator:
        EXPR [OP] EXPR

    NumericLiteral:
        1.5e+5

    FunctionCall:
        [NAME]([EXPR1], [EXPR2])
 */

/**
    Precedence:
        0. Numeric literal
        1. (...)
        2. f(...)
        3. A / B / C left-assoc
        4. A * B * C associative
        5. A - B - C left-assoc
        6. A + B + C assoc

    We are going to implement the operator precedence parser using standard LR.

    Basically, we parse tokens.

    Example is A + B * C - D

    Parse A, shift
    Parse +, shift
    Parse B, set left expression = A, lookahead * or -
        Parse *, shift, set left expression = A
        Parse C, set lhs = B, lookahead pres > *
        Parse -, set rhs = C
    Set rhs = B * C
 */

let myState = {
    curPrecedence : -1
};
let getPrecedence = char => {
    switch (char) {
        case "-":
        case "+": return 1;
        case "*":
        case "/": return 2;
    }
};

let _pExpr = null;
let pExpr = Parjs.late(() => _pExpr);
let pNumber = Parjs.float().map(x => new NumericLiteral(x));
let pLeftParen = Parjs.string("(").q;
let pRightParen = Parjs.string(")").q;
let pParenExpr = pExpr.between(pExpr);
let pIdent = Parjs.asciiLetter.many().str;
let pFunc = pIdent.then(pParenExpr).map(([name, expr]) => new FunctionCall(name, [expr]));
let pUnit = pNumber.or(pParenExpr, pFunc);

function parse() {

}


let pOp = Parjs.anyCharOf("*+/-").map((op, state) => {
    let pr = getPrecedence(op);
    state.exprs = state.exprs as any[];
    while (state.exprs[1] != null && pr <= getPrecedence(state.exprs[1])) {
        let [lhs, op, rhs] = _.drop(state.exprs as any[]);
        state.exprs.push(new BinaryOperator(op, lhs, rhs));
    }

    state.curPrecedence = pr;
});