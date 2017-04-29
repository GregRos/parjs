"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @module parjs/internal/implementation/functions
 */ const special_results_1 = require("../special-results");
/** */
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
})(StringHelpers = exports.StringHelpers || (exports.StringHelpers = {}));
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
