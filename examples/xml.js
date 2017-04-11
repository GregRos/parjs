"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("../setup");
const dist_1 = require("../dist");
const _ = require("lodash");
/**
 * Created by lifeg on 24/03/2017.
 */
let letterOrDigit = dist_1.Parjs.asciiLetter.or(dist_1.Parjs.digit);
let ident = dist_1.Parjs.asciiLetter.then(letterOrDigit.many()).str;
let quotedString = (q) => {
    return dist_1.Parjs.noCharOf(q).many().str.between(dist_1.Parjs.string(q));
};
let qSpaces = dist_1.Parjs.spaces.q;
let attribute = ident.then(dist_1.Parjs.string("=").q, quotedString("'").or(quotedString('"'))).map(([ident, value]) => ({ name: ident, value: value }));
let multipleAttributes = attribute.manySepBy(dist_1.Parjs.spaces1);
let openTag = dist_1.Parjs.seq(dist_1.Parjs.string("<").q, ident, multipleAttributes, dist_1.Parjs.spaces, dist_1.Parjs.string(">").result("open").or(dist_1.Parjs.string("/>").result("closed"))).map(([ident, attrs, kind]) => ({ ident, attrs, kind, content: [] })).map((result, state) => {
    if (result.kind === "open") {
        state.tags.push(result);
    }
    else {
        state.tags[state.tags.length - 1].content.push(result);
    }
}).q;
let closeTag = ident.between(dist_1.Parjs.string("</"), dist_1.Parjs.string(">"))
    .must((ident, state) => ident === _.last(state.tags).ident)
    .act((ident, state) => {
    let last = state.tags[state.tags.length - 1];
    let tags = state.tags.pop();
    state.tags[state.tags.length - 1].content.push(tags);
}).q;
let content = dist_1.Parjs.noCharOf('<').many().str.act((content, state) => {
    state.tags[state.tags.length - 1].content.push({ content: content });
}).q;
let root = {
    content: []
};
let tagContent = closeTag.or(openTag).many().state.map(x => x.tags[0].content);
let example = tagContent.parse("<a test='1'> <b><c></c></b></a>", { tags: [root] }).resolve;
console.log(JSON.stringify(example, null, 2));
//# sourceMappingURL=xml.js.map