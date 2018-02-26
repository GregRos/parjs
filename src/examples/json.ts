import "../__test__/setup";
import {Parjs} from "../lib/index";
import {LoudParser} from "../lib/loud";
import {ReplyKind} from "../lib/reply";

class JsonNumber {
	constructor(public value : number) {}
}

class JsonString {
	constructor(public value : string) {}
}

class JsonBool {
	constructor(public value : boolean) {}
}

class JsonArray {
	constructor (public value : JsonValue[]) {}
}

class JsonObjectProperty {
	constructor(public name : string, public value : JsonValue) {}
}

class JsonObject {
	constructor (public value : JsonObjectProperty[]) {}
}

type JsonValue = JsonNumber | JsonString | JsonBool | JsonArray | JsonObject;

let escapes = {
	"\"" : `"`,
	"\\" : "\\",
	"/" : "/",
	"f" : "\f",
	"n" : "\n",
	"r" : "\r",
	"t" : "\t"
};

let _pJsonValue : LoudParser<JsonValue> = null;
let pJsonValue = Parjs.late(() => _pJsonValue);
let pEscapeChar = Parjs.anyCharOf(Object.getOwnPropertyNames(escapes).join()).map(char => {
	let result = escapes[char];
	return result as string;
});
let pEscapeUnicode = Parjs.string("u").then(Parjs.digit.exactly(4).str.map(hexStr => Number.parseInt(hexStr, 16)));
let pEscapeAny = Parjs.string("\\").then(pEscapeChar.or(pEscapeUnicode));
let pCharOrEscape = pEscapeAny.or(Parjs.noCharOf('"'));
let pStr = pCharOrEscape.many().str.between(Parjs.string('"'));
let pJsonString = pStr.map(str => new JsonString(str));

let pNumber = Parjs.float().map(n => new JsonNumber(n));
let pBool = Parjs.anyStringOf("true", "false").map(str => new JsonBool(str === "true"));
let pArray = pJsonValue.manySepBy(Parjs.string(",")).between(Parjs.string("["), Parjs.string("]")).map(arr => new JsonArray(arr));
let pObjectProperty = pStr.then(Parjs.string(":").between(Parjs.whitespaces).q).then(pJsonValue).between(Parjs.whitespaces).map(([name, value]) => new JsonObjectProperty(name, value));
let pObject = pObjectProperty.manySepBy(Parjs.string(",")).between(Parjs.string("{"), Parjs.string("}")).map(properties => new JsonObject(properties));
_pJsonValue = Parjs.any(pJsonString, pNumber, pBool, pArray, pObject).between(Parjs.whitespaces);

function astToObject(obj : JsonValue) {
	if (obj instanceof JsonNumber) {
		return obj.value;
	} else if (obj instanceof JsonString) {
		return obj.value;
	} else if (obj instanceof JsonBool) {
		return obj.value;
	} else if (obj instanceof JsonArray) {
		return obj.value.map(x => astToObject(x));
	} else if (obj instanceof JsonObject) {
		let res = {};
		for (let prop of obj.value) {
			res[prop.name] = astToObject(prop.value);
		}
		return res;
	}
}

let result = pJsonValue.parse(`{"a" : 2, 


"b\\"" : 
44325, "z" : "hi!", "a" : true,
 "array" : ["hi", 1, {"a" :    "b\\"" }, [], {}]}`);
if (result.kind !== ReplyKind.OK) {
	console.log(Parjs.visualizer(result.trace));
} else {
	console.log(astToObject(result.value));
}