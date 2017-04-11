/**
 * @module parjs/internal/implementation/functions
 */ /** */
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Predicates;
(function (Predicates) {
    function nonEmpty(x) {
        if (x === undefined || x === null || x === "") {
            return false;
        }
        if (x instanceof Array) {
            return x.length > 0;
        }
        let proto = Object.getPrototypeOf(x);
        if (proto === Object.prototype || !proto) {
            return Object.getOwnPropertyNames(x).length > 0;
        }
        return true;
    }
    Predicates.nonEmpty = nonEmpty;
})(Predicates = exports.Predicates || (exports.Predicates = {}));
//# sourceMappingURL=predicates.js.map