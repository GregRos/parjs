"use strict";
var combinators_1 = require("./combinators");
var parsers_1 = require('../implementation/parsers');
var char_indicators_1 = require("../functions/char-indicators");
/**
 * Created by lifeg on 24/11/2016.
 */
function wrap(action) {
    return new combinators_1.JaseParser(action);
}
var JaseParsers = (function () {
    function JaseParsers() {
    }
    Object.defineProperty(JaseParsers.prototype, "anyChar", {
        get: function () {
            return wrap(new parsers_1.PrsStringLen(1));
        },
        enumerable: true,
        configurable: true
    });
    JaseParsers.prototype.charWhere = function (predicate) {
        return wrap(new parsers_1.PrsCharWhere(predicate));
    };
    JaseParsers.prototype.anyCharOf = function (options) {
        return this.charWhere(function (x) { return options.includes(x); });
    };
    JaseParsers.prototype.noCharOf = function (options) {
        return this.charWhere(function (x) { return !options.includes(x); });
    };
    Object.defineProperty(JaseParsers.prototype, "digit", {
        get: function () {
            return this.charWhere(char_indicators_1.Chars.isDigit);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(JaseParsers.prototype, "hex", {
        get: function () {
            return this.charWhere(char_indicators_1.Chars.isHex);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(JaseParsers.prototype, "upper", {
        get: function () {
            return this.charWhere(char_indicators_1.Chars.isUpper);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(JaseParsers.prototype, "lower", {
        get: function () {
            return this.charWhere(char_indicators_1.Chars.isLower);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(JaseParsers.prototype, "asciiLower", {
        get: function () {
            return this.charWhere(char_indicators_1.Chars.isAsciiLower);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(JaseParsers.prototype, "asciiUpper", {
        get: function () {
            return this.charWhere(char_indicators_1.Chars.isAsciiUpper);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(JaseParsers.prototype, "newline", {
        get: function () {
            return wrap(new parsers_1.PrsNewline(false));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(JaseParsers.prototype, "unicodeNewline", {
        get: function () {
            return wrap(new parsers_1.PrsNewline(true));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(JaseParsers.prototype, "space", {
        get: function () {
            return this.charWhere(char_indicators_1.Chars.isInlineSpace);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(JaseParsers.prototype, "unicodeSpace", {
        get: function () {
            return this.charWhere(char_indicators_1.Chars.isUnicodeInlineSpace);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(JaseParsers.prototype, "spaces", {
        get: function () {
            return this.space.many().str;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(JaseParsers.prototype, "unicodeSpaces", {
        get: function () {
            return this.unicodeSpaces.many().str;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(JaseParsers.prototype, "rest", {
        get: function () {
            return wrap(new parsers_1.PrsRest());
        },
        enumerable: true,
        configurable: true
    });
    JaseParsers.prototype.string = function (str) {
        return wrap(new parsers_1.PrsString(str));
    };
    JaseParsers.prototype.anyStringOf = function () {
        var strs = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            strs[_i - 0] = arguments[_i];
        }
        return wrap(new parsers_1.AnyStringOf(strs));
    };
    JaseParsers.prototype.stringLen = function (length) {
        return wrap(new parsers_1.PrsStringLen(length));
    };
    JaseParsers.prototype.regexp = function (regex) {
        return wrap(new parsers_1.PrsRegexp(regex));
    };
    JaseParsers.prototype.result = function (x) {
        return wrap(new parsers_1.PrsResult(x));
    };
    Object.defineProperty(JaseParsers.prototype, "eof", {
        get: function () {
            return wrap(new parsers_1.PrsEof());
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(JaseParsers.prototype, "fail", {
        get: function () {
            return wrap(new parsers_1.PrsFail());
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(JaseParsers.prototype, "position", {
        get: function () {
            return wrap(new parsers_1.PrsPosition());
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(JaseParsers.prototype, "state", {
        get: function () {
            return wrap(new parsers_1.PrsState());
        },
        enumerable: true,
        configurable: true
    });
    return JaseParsers;
}());
exports.JaseParsers = JaseParsers;
exports.Jase = new JaseParsers();
//# sourceMappingURL=parsers.js.map