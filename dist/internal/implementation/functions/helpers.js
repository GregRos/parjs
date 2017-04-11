/**
 * @module parjs/internal/implementation/functions
 */ /** */
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
})(StringHelpers = exports.StringHelpers || (exports.StringHelpers = {}));

//# sourceMappingURL=helpers.js.map
