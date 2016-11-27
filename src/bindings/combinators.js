"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * Created by User on 22-Nov-16.
 */
var combinators_1 = require('../implementation/combinators');
var jase_parser_1 = require("../base/jase-parser");
var _ = require('lodash');
function wrap(action) {
    return new JaseParser(action);
}
var JaseParser = (function (_super) {
    __extends(JaseParser, _super);
    function JaseParser() {
        _super.apply(this, arguments);
    }
    Object.defineProperty(JaseParser.prototype, "backtrack", {
        get: function () {
            return wrap(new combinators_1.PrsBacktrack(this.action));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(JaseParser.prototype, "mustCapture", {
        get: function () {
            return wrap(new combinators_1.PrsMustCapture(this.action));
        },
        enumerable: true,
        configurable: true
    });
    JaseParser.prototype.or = function () {
        var others = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            others[_i - 0] = arguments[_i];
        }
        return wrap(new combinators_1.PrsAlts(others.map(function (x) { return x.action; })));
    };
    JaseParser.prototype.map = function (f) {
        return wrap(new combinators_1.MapParser(this.action, f));
    };
    Object.defineProperty(JaseParser.prototype, "quiet", {
        get: function () {
            return wrap(new combinators_1.PrsQuiet(this.action));
        },
        enumerable: true,
        configurable: true
    });
    JaseParser.prototype.then = function (next) {
        if (_.isFunction(next)) {
            return wrap(new combinators_1.PrsSeqFunc(this.action, [next]));
        }
        else {
            var seqParse = wrap(new combinators_1.PrsSeq([this.action, next.action]));
            if (this.isLoud !== next.isLoud) {
                return seqParse.map(function (x) { return x[0]; });
            }
            else if (!this.isLoud) {
                return seqParse.quiet;
            }
            return seqParse;
        }
    };
    JaseParser.prototype.many = function (minSuccesses, maxIters) {
        if (minSuccesses === void 0) { minSuccesses = 0; }
        if (maxIters === void 0) { maxIters = Infinity; }
        return wrap(new combinators_1.PrsMany(this.action, maxIters, minSuccesses));
    };
    JaseParser.prototype.manyTill = function (till, tillOptional) {
        if (tillOptional === void 0) { tillOptional = false; }
        return wrap(new combinators_1.PrsManyTill(this.action, till.action, tillOptional));
    };
    JaseParser.prototype.manySepBy = function (sep, maxIterations) {
        if (maxIterations === void 0) { maxIterations = Infinity; }
        return wrap(new combinators_1.PrsManySepBy(this.action, sep.action, maxIterations));
    };
    JaseParser.prototype.exactly = function (count) {
        return wrap(new combinators_1.PrsExactly(this.action, count));
    };
    JaseParser.prototype.withState = function (reducer) {
        return wrap(new combinators_1.PrsWithState(this.action, reducer));
    };
    JaseParser.prototype.result = function (r) {
        return wrap(new combinators_1.PrsMapResult(this.action, r));
    };
    Object.defineProperty(JaseParser.prototype, "not", {
        get: function () {
            return wrap(new combinators_1.PrsNot(this.action));
        },
        enumerable: true,
        configurable: true
    });
    JaseParser.prototype.orVal = function (x) {
        return wrap(new combinators_1.PrsAltVal(this.action, x));
    };
    JaseParser.prototype.cast = function () {
        return this;
    };
    Object.defineProperty(JaseParser.prototype, "str", {
        get: function () {
            return wrap(new combinators_1.PrsStr(this.action));
        },
        enumerable: true,
        configurable: true
    });
    JaseParser.prototype.must = function (condition) {
        return wrap(new combinators_1.PrsMust(this.action, condition));
    };
    JaseParser.prototype.mustNotBeOf = function () {
        var options = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            options[_i - 0] = arguments[_i];
        }
        return this.must(function (x) { return !options.includes(x); });
    };
    JaseParser.prototype.mustBeOf = function () {
        var options = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            options[_i - 0] = arguments[_i];
        }
        return this.must(function (x) { return options.includes(x); });
    };
    Object.defineProperty(JaseParser.prototype, "mustBeNonEmpty", {
        get: function () {
            return this.must(function (x) {
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
            });
        },
        enumerable: true,
        configurable: true
    });
    JaseParser.prototype.alts = function () {
        var others = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            others[_i - 0] = arguments[_i];
        }
        return wrap(new combinators_1.PrsAlts(others.map(function (x) { return x.action; })));
    };
    return JaseParser;
}(jase_parser_1.JaseBaseParser));
exports.JaseParser = JaseParser;
//# sourceMappingURL=combinators.js.map