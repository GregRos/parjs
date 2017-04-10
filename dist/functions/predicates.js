/**
 * Created by lifeg on 07/12/2016.
 */
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class _PredicatesType {
    nonEmpty(x) {
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
}
exports._PredicatesType = _PredicatesType;
exports.Predicates = new _PredicatesType();

//# sourceMappingURL=predicates.js.map
