import "../test/setup";
import {Parjser} from "../lib/internal/parjser";
import {ResultKind} from "../lib/internal/result";
import {late, many, manySepBy, map, or, stringify, qthen, thenq, then, between} from "../lib/combinators";
import {anyStringOf, float, string, stringLen,anyCharOf, noCharOf, whitespace} from "../lib/index";
import {visualizeTrace} from "../lib/internal/trace-visualizer";

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

let _pJsonValue: Parjser<JsonValue> = null;

let pJsonValue = late(() => _pJsonValue);


let pEscapeChar = anyCharOf(
    Object.getOwnPropertyNames(escapes).join()
).pipe(
    map(char => escapes[char] as string)
);

// A unicode escape sequence is "u" followed by exactly 4 hex digits
let pEscapeUnicode = string("u").pipe(
    qthen(
        stringLen(4).pipe(
            map(str => parseInt(str, 16)),
            map(x => String.fromCharCode(x))
        )
    )
);

// Any escape sequence begins with a \

let pEscapeAny = string("\\").pipe(
    qthen(
        pEscapeChar.pipe(
            or(pEscapeUnicode)
        )
    )
);

// Here we process regular characters vs escape sequences
let pCharOrEscape = pEscapeAny.pipe(
    or(
        noCharOf('"')
    )
);
// Repeat the char/escape to get a sequence, and then put between quotes to get a string
let pStr = pCharOrEscape.pipe(
    many(),
    stringify(),
    between('"'),
);

// This is also a JSON string value
let pJsonString = pStr.pipe(
    map(str => new JsonString(str))
);

// Parjs has a dedicated floating point number parser
let pNumber = float().pipe(
    map(n => new JsonNumber(n))
);

// Parse bools
let pBool = anyStringOf("true", "false").pipe(
    map(str => new JsonBool(str === "true"))
);

// An array is a sequence of JSON values between ,s
let pArray = pJsonValue.pipe(
    manySepBy(","),
    between("[", "]"),
    map(arr => new JsonArray(arr))
);

// An object property is a string key, and then a value, separated by : and whitespace around it
// Plus, whitespace around the property
let pObjectProperty = pStr.pipe(
    thenq(
        string(":").pipe(
            between(
                whitespace()
            )
        )
    ),
    then(
        pJsonValue
    ),
    between(
        whitespace()
    ),
    map(([name, value]) => {
        return new JsonObjectProperty(name, value);
    })
);


// An object is a sequence of object properties between {...} separated by ","
let pObject = pObjectProperty.pipe(
    manySepBy(","),
    between("{", "}"),
    map(properties => new JsonObject(properties))
);

_pJsonValue = pJsonString.pipe(
    or(pNumber, pBool, pArray, pObject),
    between(whitespace())
);

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
if (result.kind !== ResultKind.Ok) {
    console.log(visualizeTrace(result.trace));
} else {
    console.log(astToObject(result.value));
}
