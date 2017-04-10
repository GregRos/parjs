"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Created by lifeg on 07/04/2017.
 */
require("../setup");
const parsers_1 = require("../dist/bindings/parsers");
//Built-in parser for floating point numbers.
let tupleElement = parsers_1.Parjs.float();
//Allow whitespace around elements:
let paddedElement = tupleElement.between(parsers_1.Parjs.spaces);
//Multiple instances of {paddedElement}, separated by a comma:
let separated = paddedElement.manySepBy(parsers_1.Parjs.string(","));
//Surround everything with parentheses:
let surrounded = separated.between(parsers_1.Parjs.string("("), parsers_1.Parjs.string(")"));
console.log(surrounded.parse("(1,  2 , 3 )"));
//# sourceMappingURL=tuple.js.map