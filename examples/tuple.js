"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Created by lifeg on 07/04/2017.
 */
require("../setup");
const dist_1 = require("../dist");
//Built-in parser for floating point numbers.
let tupleElement = dist_1.Parjs.float();
//Allow whitespace around elements:
let paddedElement = tupleElement.between(dist_1.Parjs.spaces);
//Multiple instances of {paddedElement}, separated by a comma:
let separated = paddedElement.manySepBy(dist_1.Parjs.string(","));
//Surround everything with parentheses:
let surrounded = separated.between(dist_1.Parjs.string("("), dist_1.Parjs.string(")"));
console.log(surrounded.parse("(1,  2 , 3 )"));
//# sourceMappingURL=tuple.js.map