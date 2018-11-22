import {Parjs} from "../lib";

// Define our identifier.
// Starts with a letter, followed by a letter or digit.
// The .str operator stringifies the array of characters.
let ident = Parjs.letter.then(Parjs.digit.or(Parjs.letter).many()).str;
//A parser that parses an opening of a tag.
let openTag = ident.between("<", ">").each((result, {tags}) => {
	tags.push({
		tag: result,
		content: []
	});
}).q;

// The close tag is </ TAG >.
let closeTag =
	ident.between("</", ">").each((result, {tags}) => {
		let topTag = tags.pop();
		tags[tags.length - 1].content.push(topTag);
	}).q;

let anyTag =
	closeTag.or(openTag).many().state.map(x => x.tags[0].content)
		.isolateState({tags: [{content: []}]});
let parsedXmlData = anyTag.parse("<a><b><c></c></b></a>");
console.log(JSON.stringify(parsedXmlData, null, 2));