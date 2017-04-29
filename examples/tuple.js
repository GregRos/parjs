"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Created by lifeg on 07/04/2017.
 */
require("../setup");
const src_1 = require("../src");
const basic_trace_visualizer_1 = require("../src/internal/implementation/basic-trace-visualizer");
//Built-in parser for floating point numbers.
let tupleElement = src_1.Parjs.float();
//Allow whitespace around elements:
let paddedElement = tupleElement.between(src_1.Parjs.spaces);
//Multiple instances of {paddedElement}, separated by a comma:
let separated = paddedElement.manySepBy(src_1.Parjs.string(","));
//Surround everything with parentheses:
let surrounded = separated.between(src_1.Parjs.string("("), src_1.Parjs.string(")"));
let ignoreWhitespace = src_1.Parjs.newline.many().then(surrounded);
console.log(surrounded.parse("(1,  2 , 3 )"));
var basic = new basic_trace_visualizer_1.BasicTraceVisualizer();
let result = ignoreWhitespace.parse(`








(1, a, 3

`);
console.log(result.toString());
//# sourceMappingURL=tuple.js.map