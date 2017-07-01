"use strict";
/**
 * @module parjs/internal/implementation/functions
 */ /** */
Object.defineProperty(exports, "__esModule", { value: true });
const special_results_1 = require("../special-results");
var StringHelpers;
(function (StringHelpers) {
    function recJoin(arr) {
        if (arr instanceof Array) {
            return arr.map(x => this.recJoin(x)).join("");
        }
        else {
            return String(arr);
        }
    }
    StringHelpers.recJoin = recJoin;
    function splice(target, where, what) {
        let start = target.slice(0, where);
        let end = target.slice(where);
        return start + what + end;
    }
    StringHelpers.splice = splice;
    function takeLines(str, start, end) {
        let matchNewline = /\r\n|\n|\r/g;
        end = Math.min(str.length, end);
        start = Math.max(0, start);
        let rows = str.split(matchNewline).splice(start, end);
        return rows;
    }
    StringHelpers.takeLines = takeLines;
})(StringHelpers = exports.StringHelpers || (exports.StringHelpers = {}));
var NumHelpers;
(function (NumHelpers) {
    function padInt(n, digits, char) {
        let str = n.toString();
        if (str.length >= digits)
            return str;
        return char.repeat(digits - str.length) + str;
    }
    NumHelpers.padInt = padInt;
})(NumHelpers = exports.NumHelpers || (exports.NumHelpers = {}));
var ArrayHelpers;
(function (ArrayHelpers) {
    function maybePush(arr, what) {
        if (what !== special_results_1.QUIET_RESULT) {
            arr.push(what);
        }
    }
    ArrayHelpers.maybePush = maybePush;
})(ArrayHelpers = exports.ArrayHelpers || (exports.ArrayHelpers = {}));
//# sourceMappingURL=helpers.js.map