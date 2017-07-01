/**
 * Created by lifeg on 07/04/2017.
 */
import "../setup";
import {Parjs, LoudParser} from "../src";
import last = require('lodash/last');


//define our identifier. Starts with a letter, followed by a letter or digit. The `str` combinator stringifies what's an array of characters.
let ident = Parjs.asciiLetter.then(Parjs.digit.or(Parjs.asciiLetter).many()).str;
//A parser that parses an opening of a tag.
let openTag = ident.between(Parjs.string("<"), Parjs.string(">")).act((result, userState) => {

    userState.tags.push({tag: result, content : []});
}).q;

let closeTag =
    ident.between(Parjs.string("</"), Parjs.string(">"))
        .must((result, userState) => result === last(userState.tags as any[]).tag)
        .act((result, userState) => {
    let topTag = userState.tags.pop();
    last(userState.tags as any[]).content.push(topTag);
}).q;

let anyTag = closeTag.or(openTag).many().state.map(x => x.tags[0].content);

console.log(JSON.stringify(anyTag.parse("<a><b><c></c></b></a>", {tags : [{content : []}]}), null ,2));



