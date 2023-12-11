import {
    between,
    later,
    many,
    manySepBy,
    map,
    or,
    qthen,
    stringify,
    then,
    thenq
} from "../lib/combinators";
import {
    anyCharOf,
    anyStringOf,
    float,
    noCharOf,
    string,
    stringLen,
    whitespace
} from "../lib/index";
import { ResultKind } from "../lib/internal/result";
import { visualizeTrace } from "../lib/internal/trace-visualizer";
import "../test/setup";

export class JsonNumber {
    constructor(public value: number) {}
}

export class JsonString {
    constructor(public value: string) {}
}

export class JsonBool {
    constructor(public value: boolean) {}
}

export class JsonArray {
    constructor(public value: JsonValue[]) {}
}

export class JsonObjectProperty {
    constructor(
        public name: string,
        public value: JsonValue
    ) {}
}

export class JsonObject {
    constructor(public value: JsonObjectProperty[]) {}
}

export type JsonValue = JsonNumber | JsonString | JsonBool | JsonArray | JsonObject;

const escapes: Record<string, string> = {
    '"': `"`,
    "\\": "\\",
    "/": "/",
    f: "\f",
    n: "\n",
    r: "\r",
    t: "\t"
};

export const pJsonValue = later<JsonValue>();

const pEscapeChar = anyCharOf(Object.getOwnPropertyNames(escapes).join()).pipe(
    map(char => escapes[char] as string)
);

// A unicode escape sequence is "u" followed by exactly 4 hex digits
const pEscapeUnicode = string("u").pipe(
    qthen(
        stringLen(4).pipe(
            map(str => parseInt(str, 16)),
            map(x => String.fromCharCode(x))
        )
    )
);

// Any escape sequence begins with a \

const pEscapeAny = string("\\").pipe(qthen(pEscapeChar.pipe(or(pEscapeUnicode))));

// Here we process regular characters vs escape sequences
const pCharOrEscape = pEscapeAny.pipe(or(noCharOf('"')));
// Repeat the char/escape to get a sequence, and then put between quotes to get a string
const pStr = pCharOrEscape.pipe(many(), stringify(), between('"'));

// This is also a JSON string value
const pJsonString = pStr.pipe(map(str => new JsonString(str)));

// Parjs has a dedicated floating point number parser
const pNumber = float().pipe(map(n => new JsonNumber(n)));

// Parse bools
const pBool = anyStringOf("true", "false").pipe(map(str => new JsonBool(str === "true")));

// An array is a sequence of JSON values between ,s
const pArray = pJsonValue.pipe(
    manySepBy(","),
    between("[", "]"),
    map(arr => new JsonArray(arr))
);

// An object property is a string key, and then a value, separated by : and whitespace around it
// Plus, whitespace around the property
const pObjectProperty = pStr.pipe(
    thenq(string(":").pipe(between(whitespace()))),
    then(pJsonValue),
    between(whitespace()),
    map(([name, value]) => {
        return new JsonObjectProperty(name, value);
    })
);

// An object is a sequence of object properties between {...} separated by ","
const pObject = pObjectProperty.pipe(
    manySepBy(","),
    between("{", "}"),
    map(properties => new JsonObject(properties))
);

pJsonValue.init(pJsonString.pipe(or(pNumber, pBool, pArray, pObject), between(whitespace())));

function astToObject(obj: JsonValue): unknown {
    if (obj instanceof JsonNumber) {
        return obj.value;
    } else if (obj instanceof JsonString) {
        return obj.value;
    } else if (obj instanceof JsonBool) {
        return obj.value;
    } else if (obj instanceof JsonArray) {
        return obj.value.map(x => astToObject(x));
    } else if (obj instanceof JsonObject) {
        const res: Record<string, unknown> = {};
        for (const prop of obj.value) {
            res[prop.name] = astToObject(prop.value);
        }
        return res;
    }
}

export const exampleInput = `{"a" : 2, 


"b\\"" : 
44325, "z" : "hi!", "a" : true,
 "array" : ["hi", 1, {"a" :    "b\\"" }, [], {}]}`;

export function runExample() {
    const result = pJsonValue.parse(exampleInput);
    if (result.kind !== ResultKind.Ok) {
        console.log(visualizeTrace(result.trace));
    } else {
        console.log(astToObject(result.value));
    }
}
