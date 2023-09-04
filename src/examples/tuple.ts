import "../test/setup";
import { between, manySepBy } from "../lib/combinators";
import { float, whitespace } from "../lib";

// Built-in parser for floating point numbers.
const tupleElement = float();

// Allow whitespace around elements:
const paddedElement = tupleElement.pipe(between(whitespace()));
// Multiple instances of {paddedElement}, separated by a comma:
const separated = paddedElement.pipe(manySepBy(","));

// Surround everything with parentheses:
const surrounded = separated.pipe(between("(", ")"), between(whitespace()));

console.log(surrounded.parse("(1,  2 , 3 )"));

const result = surrounded.parse(`








(1, a, 3

`);
console.log(result.toString());
