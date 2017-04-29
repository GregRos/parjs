import {StringHelpers} from "../functions/helpers";
import wordwrap = require('word-wrap');
import _ = require('lodash');


function stringifySimple(obj) {
    function act() {
        let a = [null, undefined].includes(obj);
        let b = ["number", "string"].includes(typeof obj);
        let c = [String, Number, Date, Symbol].includes(obj.constructor)
        if ([null, undefined].includes(obj)
            || ["number", "string"].includes(typeof obj)
            || [String, Number, Date, Symbol].includes(obj.constructor)
        ) {
            return String(obj);
        }
        else if (obj instanceof Function) {
            return `function ${obj.name}`;
        }
        return undefined;
    }
    let x = act();
    if (!x) return undefined;
    let result = x;
    if (result.match(/\n/)) {
        return "\n" + result;
    } else {
        return result;
    }
}

function stringifyArray(arr : any[]) {
    let total = "\n";
    for (let item of arr) {
        let result = stringifyObj(item);
        total += "  - " + result.replace(/r\n/g, `\n    `);
    }
    return total;
}

function stringifyProps(obj : any) {
    let total = "";
    for (let key in obj) {
        total += "\n";
        if (!obj.hasOwnProperty(key)) continue;
        let val = obj[key];
        let result = stringifyObj(val).replace(/\n|\r\n|\r/g, "\n  ");
        total += `${key}: ${result}`;
    }
    return total;
}

function stringifyObj(obj : any) {
    let simple = stringifySimple(obj);
    if (simple !== undefined) {
        return simple;
    }
    if (obj instanceof Array) {
        return stringifyArray(obj);
    }
    return stringifyProps(obj);
}

/**
 * @external
 */
export function prettyPrint(obj : any) {
    return stringifyObj(obj);
}