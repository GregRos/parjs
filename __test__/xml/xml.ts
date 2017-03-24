import {Parjs} from "../../src/bindings/parsers";
import {LoudParser} from "../../src/abstract/combinators/loud";
/**
 * Created by lifeg on 24/03/2017.
 */

let letterOrDigit = Parjs.asciiLetter.or(Parjs.digit);

let ident = Parjs.asciiLetter.then(letterOrDigit).str;

let xml : LoudParser<any>;
let quotedString = (q : string) : LoudParser<string> => {
    return Parjs.string("").many().str.between(Parjs.string(q));;
};

let qSpaces = Parjs.spaces.q;

let attribute =
    ident.then(
        qSpaces,
        Parjs.string("=").q,
        quotedString("'").or(quotedString('"'))
    ).map(([ident, value]) => ({name : ident, value : value}));

let multipleAttributes = attribute.

let tag = Parjs.seq(
    Parjs.string("<").q,
    ident
);