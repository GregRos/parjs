/**
 * Created by lifeg on 04/04/2017.
 */
import "../setup";
import {Parjs, LoudParser} from "../src";
//+ DEFINING THE PARSER

//Parse an identifier, an asciiLetter followed by an asciiLetter or digit, e.g. a12b but not 1ab.
let ident = Parjs.letter.then(Parjs.letter.or(Parjs.digit).many()).str;

//Parse a format token, an `ident` between `{` and `}`. Return the result as a Token object.
let formatToken = ident.between(Parjs.string("{"), Parjs.string("}")).map(x => ({token: x}));

//Parse an escaped character. This parses "`{a}" as the text "{a}" instead of a token.
//Also escapes the escaped char, parsing "``" as "`".
//Works for arbitrary characters like `a being parsed as a.
let escape = Parjs.string("`").then(Parjs.anyChar).str.map(x => ({text: x.substr(1)}));

//Parse text which is not an escape character or {.
let text = Parjs.noCharOf("`{").many(1).str.map(x => ({text: x}));

//The parser itself. Parses either a formatToken, e.g. {abc} or an escaped combo `x, or text that doesn't contain `{.
//Parses many times.
let formatParser = formatToken.or(escape, text).many();


//This prints a sequence of tokens {text: "hello, my name is "}, {token: name}, {text: " and I am "}, {token: " years old}, ...
console.log(formatParser.parse("hello, my name is {name} and I am {age} years old. This is `{escaped}. This is double escaped: ``{name}."));

function toTemplate(formatString : string) {
    let stream = formatParser.parse(formatString).value;
    return {
        inject(args : object) {
            let str = "";
            stream.forEach((x : any) => {
                if (x.text) {
                    str += x.text;
                } else if (x.token) {
                    str += args[x.token];
                }
            });
            return str;
        }
    };
}

let template = toTemplate("hello, my name is {name} and I am {age} years old. This is `{escaped}. This is double escaped: ``{name}.");

console.log(template.inject({
    name : "Greg",
    age : 28
}));