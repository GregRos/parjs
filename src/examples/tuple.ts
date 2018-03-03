/**
 * Created by lifeg on 07/04/2017.
 */
import "../__test__/setup";
import {Parjs} from "../lib";
import {BasicTraceVisualizer} from "../lib/internal/implementation/basic-trace-visualizer";
//Built-in parser for floating point numbers.
let tupleElement = Parjs.float();
//Allow whitespace around elements:
let paddedElement = tupleElement.between(Parjs.whitespaces);
//Multiple instances of {paddedElement}, separated by a comma:
let separated = paddedElement.manySepBy(Parjs.string(","));

//Surround everything with parentheses:
let surrounded = separated.between(Parjs.string("("), Parjs.string(")"));
let ignoreWhitespace = Parjs.newline.many().then(surrounded);
console.log(surrounded.parse("(1,  2 , 3 )"));

var basic = BasicTraceVisualizer();
let result = ignoreWhitespace.parse(`








(1, a, 3

`);
console.log(result.toString());