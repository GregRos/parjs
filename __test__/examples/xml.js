"use strict";
require("../setup");
const parsers_1 = require("../../src/bindings/parsers");
const _ = require("lodash");
/**
 * Created by lifeg on 24/03/2017.
 */
let letterOrDigit = parsers_1.Parjs.asciiLetter.or(parsers_1.Parjs.digit);
let ident = parsers_1.Parjs.asciiLetter.then(letterOrDigit.many()).str;
let quotedString = (q) => {
    return parsers_1.Parjs.noCharOf(q).many().str.between(parsers_1.Parjs.string(q));
};
let qSpaces = parsers_1.Parjs.spaces.q;
let attribute = ident.then(parsers_1.Parjs.string("=").q, quotedString("'").or(quotedString('"'))).map(([ident, value]) => ({ name: ident, value: value }));
let multipleAttributes = attribute.manySepBy(parsers_1.Parjs.spaces1);
let openTag = parsers_1.Parjs.seq(parsers_1.Parjs.string("<").q, ident, multipleAttributes, parsers_1.Parjs.spaces, parsers_1.Parjs.string(">").result("open").or(parsers_1.Parjs.string("/>").result("closed"))).map(([ident, attrs, kind]) => ({ ident, attrs, kind, content: [] })).map((result, state) => {
    if (result.kind === "open") {
        state.tags.push(result);
    }
    else {
        state.tags[state.tags.length - 1].content.push(result);
    }
}).q;
let closeTag = ident.between(parsers_1.Parjs.string("</"), parsers_1.Parjs.string(">"))
    .must((ident, state) => ident === _.last(state.tags).ident)
    .act((ident, state) => {
    let last = state.tags[state.tags.length - 1];
    let tags = state.tags.pop();
    state.tags[state.tags.length - 1].content.push(tags);
}).q;
let content = parsers_1.Parjs.noCharOf('<').many().str.act((content, state) => {
    state.tags[state.tags.length - 1].content.push({ content: content });
}).q;
let root = {
    content: []
};
let tagContent = closeTag.or(openTag).many().state.map(x => x.tags[0].content);
let example = tagContent.parse("<a test='1'> <b><c></c></b></a>", { tags: [root] }).resolve;
console.log(JSON.stringify(example, null, 2));
//# sourceMappingURL=xml.js.map