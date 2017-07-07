import "../setup";

import {Parjs, LoudParser} from "../src";
import _ = require('lodash');
/**
 * Created by lifeg on 24/03/2017.
 */

let letterOrDigit = Parjs.letter.or(Parjs.digit);

let ident = Parjs.letter.then(letterOrDigit.many()).str;

let quotedString = (q : string) : LoudParser<string> => {
    return Parjs.noCharOf(q).many().str.between(Parjs.string(q));
};

let qSpaces = Parjs.whitespaces.q;

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
    Parjs.whitespaces.q,
    Parjs.string(">").result("open").or(Parjs.string("/>").result("closed")),
).map(([ident, attrs, kind]) => ({ident, attrs, kind, content : []})).map((result, state) => {
    if (result.kind === "open") {
        state.tags.push(result);
    } else {
        state.tags[state.tags.length - 1].content.push(result);
    }
}).q;

let closeTag = ident.between(Parjs.string("</"), Parjs.string(">"))
    .must((ident, state) => ident === _.last(state.tags as any[]).ident)
    .act((ident, state) => {
    let last = state.tags[state.tags.length - 1];
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

let example = tagContent.parse("<a><b><c></c></b></a>", {tags : [root]}).value;
console.log(JSON.stringify(example, null, 2));