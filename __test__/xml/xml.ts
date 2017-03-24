import {Parjs} from "../../src/bindings/parsers";
/**
 * Created by lifeg on 24/03/2017.
 */

let letterOrDigit = Parjs.asciiLetter.or(Parjs.digit);

let ident = Parjs.asciiLetter.then(letterOrDigit).str;

let quotedString = (q : string) => {
    let pQ = Parjs.char(q).quiet;
    return pQ.then(Parjs.noCharOf(q).many().str).then(pQ);
};

let pqSpaces = Parjs.spaces.quiet;

let attribute =
    ident.then(
        pqSpaces,
        Parjs.char("=").quiet,
        pqSpaces,
        quotedString("'").or(quotedString('"')),
    ).map(([ident, value]) => ({name : ident, value : value}));

let tag =
    Parjs.char('<').quiet.then(ident).then(Parjs.char('>').quiet);
