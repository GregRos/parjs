"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Created by lifeg on 04/04/2017.
 */
require("../setup");
const src_1 = require("../src");
//+ DEFINING THE PARSER
//Parse an identifier, an asciiLetter followed by an asciiLetter or digit, e.g. a12b but not 1ab.
let ident = src_1.Parjs.asciiLetter.then(src_1.Parjs.asciiLetter.or(src_1.Parjs.digit).many()).str;
//Parse a format token, an `ident` between `{` and `}`. Return the result as a Token object.
let formatToken = ident.between(src_1.Parjs.string("{"), src_1.Parjs.string("}")).map(x => ({ token: x }));
//Parse an escaped character. This parses "`{a}" as the text "{a}" instead of a token.
//Also escapes the escaped char, parsing "``" as "`".
//Works for arbitrary characters like `a being parsed as a.
let escape = src_1.Parjs.string("`").then(src_1.Parjs.anyChar).str.map(x => ({ text: x.substr(1) }));
//Parse text which is not an escape character or {.
let text = src_1.Parjs.noCharOf("`{").many(1).str.map(x => ({ text: x }));
//The parser itself. Parses either a formatToken, e.g. {abc} or an escaped combo `x, or text that doesn't contain `{.
//Parses many times.
let formatParser = formatToken.or(escape, text).many();
//This prints a sequence of tokens {text: "hello, my name is "}, {token: name}, {text: " and I am "}, {token: " years old}, ...
console.log(formatParser.parse("hello, my name is {name} and I am {age} years old. This is `{escaped}. This is double escaped: ``{name}."));
function toTemplate(formatString) {
    let stream = formatParser.parse(formatString).value;
    return {
        inject(args) {
            let str = "";
            stream.forEach((x) => {
                if (x.text) {
                    str += x.text;
                }
                else if (x.token) {
                    str += args[x.token];
                }
            });
            return str;
        }
    };
}
let template = toTemplate("hello, my name is {name} and I am {age} years old. This is `{escaped}. This is double escaped: ``{name}.");
console.log(template.inject({
    name: "Greg",
    age: 28
}));
//# sourceMappingURL=string.format.js.map