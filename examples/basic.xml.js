"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Created by lifeg on 07/04/2017.
 */
require("../setup");
const src_1 = require("../src");
const _ = require("lodash");
//define our identifier. Starts with a letter, followed by a letter or digit. The `str` combinator stringifies what's an array of characters.
let ident = src_1.Parjs.asciiLetter.then(src_1.Parjs.digit.or(src_1.Parjs.asciiLetter).many()).str;
//A parser that parses an opening of a tag.
let openTag = ident.between(src_1.Parjs.string("<"), src_1.Parjs.string(">")).act((result, userState) => {
    userState.tags.push({ tag: result, content: [] });
}).q;
let closeTag = ident.between(src_1.Parjs.string("</"), src_1.Parjs.string(">"))
    .must((result, userState) => result === _.last(userState.tags).tag)
    .act((result, userState) => {
    let topTag = userState.tags.pop();
    _.last(userState.tags).content.push(topTag);
}).q;
let anyTag = closeTag.or(openTag).many().state.map(x => x.tags[0].content);
console.log(JSON.stringify(anyTag.parse("<a><b><c></c></b></a>", { tags: [{ content: [] }] }), null, 2));
//# sourceMappingURL=basic.xml.js.map