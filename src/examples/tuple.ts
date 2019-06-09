/**
 * Created by lifeg on 07/04/2017.
 */
import "../test/setup";
import {between, many, manySepBy} from "../lib/combinators";
import {float, newline, whitespace} from "../lib";

//Built-in parser for floating point numbers.
let tupleElement = float();
//Allow whitespace around elements:
let paddedElement = tupleElement.pipe(
    between(whitespace())
);
//Multiple instances of {paddedElement}, separated by a comma:
let separated = paddedElement.pipe(
    manySepBy(",")
);

//Surround everything with parentheses:
let surrounded = separated.pipe(
    between("(", ")"),
    between(whitespace())
);

console.log(surrounded.parse("(1,  2 , 3 )"));

let result = surrounded.parse(`








(1, a, 3

`);
console.log(result.toString());
