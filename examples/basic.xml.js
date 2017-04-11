"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Created by lifeg on 07/04/2017.
 */
require("../setup");
const dist_1 = require("../dist");
const _ = require("lodash");
//define our identifier. Starts with a letter, followed by a letter or digit. The `str` combinator stringifies what's an array of characters.
let ident = dist_1.Parjs.asciiLetter.then(dist_1.Parjs.digit.or(dist_1.Parjs.asciiLetter).many()).str;
//A parser that parses an opening of a tag.
let openTag = ident.between(dist_1.Parjs.string("<"), dist_1.Parjs.string(">")).act((result, state) => {
    state.tags.push({ tag: result, content: [] });
}).q;
let closeTag = ident.between(dist_1.Parjs.string("</"), dist_1.Parjs.string(">"))
    .must((result, state) => result === _.last(state.tags).tag)
    .act((result, state) => {
    let topTag = state.tags.pop();
    _.last(state.tags).content.push(topTag);
}).q;
let anyTag = closeTag.or(openTag).many().state.map(x => x.tags[0].content);
console.log(JSON.stringify(anyTag.parse("<a><b><c></c></b></a>", { tags: [{ content: [] }] }), null, 2));
//# sourceMappingURL=basic.xml.js.map