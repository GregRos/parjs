/**
 * Created by lifeg on 07/04/2017.
 */
import "../setup";
import {Parjs} from "../dist";
import _ = require('lodash');

//define our identifier. Starts with a letter, followed by a letter or digit. The `str` combinator stringifies what's an array of characters.
let ident = Parjs.asciiLetter.then(Parjs.digit.or(Parjs.asciiLetter).many()).str;
//A parser that parses an opening of a tag.
let openTag = ident.between(Parjs.string("<"), Parjs.string(">")).act((result, state) => {

    state.tags.push({tag: result, content : []});
}).q;

let closeTag =
    ident.between(Parjs.string("</"), Parjs.string(">"))
        .must((result, state) => result === _.last(state.tags as any[]).tag)
        .act((result, state) => {
    let topTag = state.tags.pop();
    _.last(state.tags as any[]).content.push(topTag);
}).q;

let anyTag = closeTag.or(openTag).many().state.map(x => x.tags[0].content);

console.log(JSON.stringify(anyTag.parse("<a><b><c></c></b></a>", {tags : [{content : []}]}), null ,2));



