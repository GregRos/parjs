import 'source-map-support/register'

import {Parjs} from "../../src/bindings/parsers";
import {LoudParser} from "../../src/abstract/combinators/loud";
import {ParsingFailureSignal} from "../../src/base/parsing-failure";
/**
 * Created by lifeg on 24/03/2017.
 */

let letterOrDigit = Parjs.asciiLetter.or(Parjs.digit);

let ident = Parjs.asciiLetter.then(letterOrDigit.many()).str;

let xml : LoudParser<any>;
let quotedString = (q : string) : LoudParser<string> => {
    return Parjs.noCharOf(q).many().str.between(Parjs.string(q));
};

let qSpaces = Parjs.spaces.q;

let attribute =
    ident.then(
        Parjs.string("=").q,
        quotedString("'").or(quotedString('"'))
    ).map(([ident, value]) => ({name : ident, value : value}));

let multipleAttributes = attribute.manySepBy(Parjs.spaces1);

let openTag = Parjs.seq(
    Parjs.string("<").q,
    ident,
    multipleAttributes,
    Parjs.spaces,
    Parjs.string(">").result("open").or(Parjs.string("/>").result("closed")),
).map(([ident, attrs, kind]) => ({ident, attrs, kind, content : []})).map((result, state) => {
    if (result.kind === "open") {
        state.tags.push(result);
    } else {
        state.tags[state.tags.length - 1].content.push(result);
    }
}).q;

let closeTag = ident.between(Parjs.string("</"), Parjs.string(">")).act((ident, state) => {
    let last = state.tags[state.tags.length - 1];
    if (last.ident !== ident) {
        throw new ParsingFailureSignal("Unexpected close tags", "HardFail");
    }
    let tags = state.tags.pop();
    state.tags[state.tags.length - 1].content.push(tags);
}).q;

let content = Parjs.noCharOf('<').many().str.act((content, state) => {
    state.tags[state.tags.length - 1].content.push({content : content});
}).q;

let root = {
    content : []
};

let tagContent = closeTag.or(openTag).many().state.map(x => x.tags[0].content);

let example = tagContent.parse("<a test='1'> <b><c></c></b></a>", {tags : [root]}).resolve;
console.log(JSON.stringify(example, null, 2));