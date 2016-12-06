/**
 * Created by lifeg on 07/12/2016.
 */
"use strict";
var _PredicatesType = (function () {
    function _PredicatesType() {
    }
    _PredicatesType.prototype.nonEmpty = function (x) {
        if (x === undefined || x === null || x === "") {
            return false;
        }
        if (x instanceof Array) {
            return x.length > 0;
        }
        var proto = Object.getPrototypeOf(x);
        if (proto === Object.prototype || !proto) {
            return Object.getOwnPropertyNames(x).length > 0;
        }
        return true;
    };
    return _PredicatesType;
}());
exports._PredicatesType = _PredicatesType;
exports.Predicates = new _PredicatesType();
