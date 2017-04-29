"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("../setup");
const src_1 = require("../src");
const _ = require("lodash");
/**
 * Created by lifeg on 24/03/2017.
 */
let letterOrDigit = src_1.Parjs.asciiLetter.or(src_1.Parjs.digit);
let ident = src_1.Parjs.asciiLetter.then(letterOrDigit.many()).str;
let quotedString = (q) => {
    return src_1.Parjs.noCharOf(q).many().str.between(src_1.Parjs.string(q));
};
let qSpaces = src_1.Parjs.spaces.q;
let attribute = ident.then(src_1.Parjs.string("=").q, quotedString("'").or(quotedString('"'))).map(([ident, value]) => ({ name: ident, value: value }));
let multipleAttributes = attribute.manySepBy(src_1.Parjs.spaces1);
let openTag = src_1.Parjs.seq(src_1.Parjs.string("<").q, ident, multipleAttributes, src_1.Parjs.spaces.q, src_1.Parjs.string(">").result("open").or(src_1.Parjs.string("/>").result("closed"))).map(([ident, attrs, kind]) => ({ ident, attrs, kind, content: [] })).map((result, state) => {
    if (result.kind === "open") {
        state.tags.push(result);
    }
    else {
        state.tags[state.tags.length - 1].content.push(result);
    }
}).q;
let closeTag = ident.between(src_1.Parjs.string("</"), src_1.Parjs.string(">"))
    .must((ident, state) => ident === _.last(state.tags).ident)
    .act((ident, state) => {
    let last = state.tags[state.tags.length - 1];
    let tags = state.tags.pop();
    state.tags[state.tags.length - 1].content.push(tags);
}).q;
let content = src_1.Parjs.noCharOf('<').many().str.act((content, state) => {
    state.tags[state.tags.length - 1].content.push({ content: content });
}).q;
let root = {
    content: []
};
let tagContent = closeTag.or(openTag).many().state.map(x => x.tags[0].content);
let example = tagContent.parse("<a><b><c></c></b></a>", { tags: [root] }).value;
console.log(JSON.stringify(example, null, 2));
//# sourceMappingURL=xml.js.map