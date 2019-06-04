import "../test/setup";
import {Parjs} from "../lib/index";
import {LoudParser} from "../lib/loud";
import {ReplyKind} from "../lib/reply";

class JsonNumber {
    constructor(public value: number) {
    }
}

class JsonString {
    constructor(public value: string) {
    }
}

class JsonBool {
    constructor(public value: boolean) {
    }
}

class JsonArray {
    constructor(public value: JsonValue[]) {
    }
}

class JsonObjectProperty {
    constructor(public name: string, public value: JsonValue) {
    }
}

class JsonObject {
    constructor(public value: JsonObjectProperty[]) {
    }
}

type JsonValue = JsonNumber | JsonString | JsonBool | JsonArray | JsonObject;

let escapes = {
    "\"": `"`,
    "\\": "\\",
    "/": "/",
    f: "\f",
    n: "\n",
    r: "\r",
    t: "\t"
};

let _pJsonValue: LoudParser<JsonValue> = null;
let pJsonValue = Parjs.late(() => _pJsonValue);
let pEscapeChar = Parjs.anyCharOf(Object.getOwnPropertyNames(escapes).join()).map(char => {
    let result = escapes[char];
    return result as string;
});

// A unicode escape sequence is "u" followed by exactly 4 hex digits
let pEscapeUnicode = Parjs.string("u").then(Parjs.hex.exactly(4).str.map(hexStr => parseInt(hexStr, 16)));

// Any escape sequence begins with a \
let pEscapeAny = Parjs.string("\\").then(pEscapeChar.or(pEscapeUnicode));

// Here we process regular characters vs escape sequences
let pCharOrEscape = pEscapeAny.or(Parjs.noCharOf('"'));

// Repeat the char/escape to get a sequence, and then put between quotes to get a string
let pStr = pCharOrEscape.many().str.between('"');

// This is also a JSON string value
let pJsonString = pStr.map(str => new JsonString(str));

// Parjs has a dedicated floating point number parser
let pNumber = Parjs.float().map(n => new JsonNumber(n));

// Parse bools
let pBool = Parjs.anyStringOf("true", "false").map(str => new JsonBool(str === "true"));

// An array is a sequence of JSON values between ,s
let pArray = pJsonValue.manySepBy(",").between("[", "]").map(arr => new JsonArray(arr));

// An object property is a string key, and then a value, separated by : and whitespace around it
// Plus, whitespace around the property
let pObjectProperty =
    pStr.then(Parjs.string(":").between(Parjs.whitespaces).q)
        .then(pJsonValue).between(Parjs.whitespaces)
        .map(([name, value]) => new JsonObjectProperty(name, value));

// An object is a sequence of object properties between {...} separated by ","
let pObject = pObjectProperty.manySepBy(",").between("{", "}").map(properties => new JsonObject(properties));
_pJsonValue = Parjs.any(pJsonString, pNumber, pBool, pArray, pObject).between(Parjs.whitespaces);

function astToObject(obj: JsonValue) {
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
if (result.kind !== ReplyKind.Ok) {
    console.log(Parjs.visualizer(result.trace));
} else {
    console.log(astToObject(result.value));
}