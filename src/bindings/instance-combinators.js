"use strict";
var tslib_1 = require("tslib");
/**
 * Created by User on 22-Nov-16.
 */
var combinators_1 = require("../implementation/combinators");
var parser_1 = require("../base/parser");
var predicates_1 = require("../functions/predicates");
var result_1 = require("../abstract/basics/result");
var soft_1 = require("../implementation/combinators/alternatives/soft");
function wrap(action) {
    return new ParjsParser(action);
}
var ParjsParser = (function (_super) {
    tslib_1.__extends(ParjsParser, _super);
    function ParjsParser() {
        return _super.apply(this, arguments) || this;
    }
    Object.defineProperty(ParjsParser.prototype, "backtrack", {
        get: function () {
            return wrap(new combinators_1.PrsBacktrack(this.action));
        },
        enumerable: true,
        configurable: true
    });
    ParjsParser.prototype.mustCapture = function (failType) {
        if (failType === void 0) { failType = result_1.ResultKind.HardFail; }
        return wrap(new combinators_1.PrsMustCapture(this.action, result_1.toResultKind(failType)));
    };
    ParjsParser.prototype.or = function () {
        var others = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            others[_i] = arguments[_i];
        }
        return wrap(new combinators_1.PrsAlts([this].concat(others).map(function (x) { return x.action; })));
    };
    ParjsParser.prototype.map = function (f) {
        return wrap(new combinators_1.MapParser(this.action, f));
    };
    Object.defineProperty(ParjsParser.prototype, "quiet", {
        get: function () {
            return wrap(new combinators_1.PrsQuiet(this.action));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ParjsParser.prototype, "soft", {
        get: function () {
            return wrap(new soft_1.PrsSoft(this.action));
        },
        enumerable: true,
        configurable: true
    });
    ParjsParser.prototype.then = function () {
        var next = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            next[_i] = arguments[_i];
        }
        var actions = [this.action].concat(next.map(function (x) { return x.action; }));
        var seqParse = wrap(new combinators_1.PrsSeq(actions));
        var loudCount = actions.filter(function (x) { return x.isLoud; }).length;
        if (loudCount === 1) {
            return seqParse.map(function (x) { return x[0]; });
        }
        else if (loudCount === 0) {
            return seqParse.quiet;
        }
        else {
            return seqParse;
        }
    };
    ParjsParser.prototype.many = function (minSuccesses, maxIters) {
        if (minSuccesses === void 0) { minSuccesses = 0; }
        if (maxIters === void 0) { maxIters = Infinity; }
        return wrap(new combinators_1.PrsMany(this.action, maxIters, minSuccesses));
    };
    ParjsParser.prototype.manyTill = function (till, tillOptional) {
        if (tillOptional === void 0) { tillOptional = false; }
        return wrap(new combinators_1.PrsManyTill(this.action, till.action, tillOptional));
    };
    ParjsParser.prototype.manySepBy = function (sep, maxIterations) {
        if (maxIterations === void 0) { maxIterations = Infinity; }
        return wrap(new combinators_1.PrsManySepBy(this.action, sep.action, maxIterations));
    };
    ParjsParser.prototype.exactly = function (count) {
        return wrap(new combinators_1.PrsExactly(this.action, count));
    };
    ParjsParser.prototype.withState = function (reducer) {
        var reducer2;
        if (typeof reducer !== "function") {
            reducer2 = function () { return reducer; };
        }
        else {
            reducer2 = reducer;
        }
        return wrap(new combinators_1.PrsWithState(this.action, reducer2));
    };
    ParjsParser.prototype.result = function (r) {
        return wrap(new combinators_1.PrsMapResult(this.action, r));
    };
    Object.defineProperty(ParjsParser.prototype, "not", {
        get: function () {
            return wrap(new combinators_1.PrsNot(this.action));
        },
        enumerable: true,
        configurable: true
    });
    ParjsParser.prototype.orVal = function (x) {
        return wrap(new combinators_1.PrsAltVal(this.action, x));
    };
    ParjsParser.prototype.cast = function () {
        return this;
    };
    Object.defineProperty(ParjsParser.prototype, "str", {
        get: function () {
            return wrap(new combinators_1.PrsStr(this.action));
        },
        enumerable: true,
        configurable: true
    });
    ParjsParser.prototype.must = function (condition, name, fail) {
        if (name === void 0) { name = "(unnamed condition)"; }
        if (fail === void 0) { fail = result_1.ResultKind.HardFail; }
        return wrap(new combinators_1.PrsMust(this.action, condition, result_1.toResultKind(fail), name));
    };
    ParjsParser.prototype.mustNotBeOf = function () {
        var options = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            options[_i] = arguments[_i];
        }
        return this.must(function (x) { return !options.includes(x); }, "none of: " + options.join(", "));
    };
    ParjsParser.prototype.mustBeOf = function () {
        var options = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            options[_i] = arguments[_i];
        }
        return this.must(function (x) { return options.includes(x); }, "one of: " + options.join(", "));
    };
    Object.defineProperty(ParjsParser.prototype, "mustBeNonEmpty", {
        get: function () {
            return this.must(function (x) {
                return predicates_1.Predicates.nonEmpty(x);
            }, "be non-empty", result_1.ResultKind.HardFail);
        },
        enumerable: true,
        configurable: true
    });
    return ParjsParser;
}(parser_1.BaseParjsParser));
exports.ParjsParser = ParjsParser;
//# sourceMappingURL=instance-combinators.js.map