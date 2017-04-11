/**
 * Created by lifeg on 07/04/2017.
 */
import "../setup";
import {Parjs} from "../dist";

//Built-in parser for floating point numbers.
let tupleElement = Parjs.float();
//Allow whitespace around elements:
let paddedElement = tupleElement.between(Parjs.spaces);
//Multiple instances of {paddedElement}, separated by a comma:
let separated = paddedElement.manySepBy(Parjs.string(","));

//Surround everything with parentheses:
let surrounded = separated.between(Parjs.string("("), Parjs.string(")"));

console.log(surrounded.parse("(1,  2 , 3 )"));
