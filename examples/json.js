"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("../setup");
const index_1 = require("../src/index");
const reply_1 = require("../src/reply");
class JsonNumber {
    constructor(value) {
        this.value = value;
    }
}
class JsonString {
    constructor(value) {
        this.value = value;
    }
}
class JsonBool {
    constructor(value) {
        this.value = value;
    }
}
class JsonArray {
    constructor(value) {
        this.value = value;
    }
}
class JsonObjectProperty {
    constructor(name, value) {
        this.name = name;
        this.value = value;
    }
}
class JsonObject {
    constructor(value) {
        this.value = value;
    }
}
let escapes = {
    "\"": `"`,
    "\\": "\\",
    "/": "/",
    "f": "\f",
    "n": "\n",
    "r": "\r",
    "t": "\t"
};
let _pJsonValue = null;
let pJsonValue = index_1.Parjs.late(() => _pJsonValue);
let pEscapeChar = index_1.Parjs.anyCharOf(Object.getOwnPropertyNames(escapes).join()).map(char => {
    let result = escapes[char];
    return result;
});
let pEscapeUnicode = index_1.Parjs.string("u").then(index_1.Parjs.digit.exactly(4).str.map(hexStr => Number.parseInt(hexStr, 16)));
let pEscapeAny = index_1.Parjs.string("\\").then(pEscapeChar.or(pEscapeUnicode));
let pCharOrEscape = pEscapeAny.or(index_1.Parjs.noCharOf('"'));
let pStr = pCharOrEscape.many().str.between(index_1.Parjs.string('"'));
let pJsonString = pStr.map(str => new JsonString(str));
let pNumber = index_1.Parjs.float().map(n => new JsonNumber(n));
let pBool = index_1.Parjs.anyStringOf("true", "false").map(str => new JsonBool(str === "true"));
let pArray = pJsonValue.manySepBy(index_1.Parjs.string(",")).between(index_1.Parjs.string("["), index_1.Parjs.string("]")).map(arr => new JsonArray(arr));
let pObjectProperty = pStr.then(index_1.Parjs.string(":").between(index_1.Parjs.whitespaces).q).then(pJsonValue).between(index_1.Parjs.whitespaces).map(([name, value]) => new JsonObjectProperty(name, value));
let pObject = pObjectProperty.manySepBy(index_1.Parjs.string(",")).between(index_1.Parjs.string("{"), index_1.Parjs.string("}")).map(properties => new JsonObject(properties));
_pJsonValue = index_1.Parjs.any(pJsonString, pNumber, pBool, pArray, pObject).between(index_1.Parjs.whitespaces);
function astToObject(obj) {
    if (obj instanceof JsonNumber) {
        return obj.value;
    }
    else if (obj instanceof JsonString) {
        return obj.value;
    }
    else if (obj instanceof JsonBool) {
        return obj.value;
    }
    else if (obj instanceof JsonArray) {
        return obj.value.map(x => astToObject(x));
    }
    else if (obj instanceof JsonObject) {
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
if (result.kind !== reply_1.ReplyKind.OK) {
    console.log(index_1.Parjs.visualizer.visualize(result.trace));
}
else {
    console.log(astToObject(result.value));
}
//# sourceMappingURL=json.js.map