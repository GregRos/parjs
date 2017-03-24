"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Created by User on 21-Nov-16.
 */
exports.QUIET_RESULT = Object.create(null);
exports.FAIL_RESULT = Object.create(null);
exports.UNINITIALIZED_RESULT = Object.create(null);
var Issues;
(function (Issues) {
    function stringWrongLength(_a, lengthHint) {
        var displayName = _a.displayName;
        throw new Error("The parser " + displayName + " accepts only strings of length " + lengthHint);
    }
    Issues.stringWrongLength = stringWrongLength;
    function mixedLoudnessNotPermitted(_a) {
        var displayName = _a.displayName;
        throw new Error("Parsers of mixed loudness are not permitted as arguments for the combinator '" + displayName + "'");
    }
    Issues.mixedLoudnessNotPermitted = mixedLoudnessNotPermitted;
    function guardAgainstInfiniteLoop(_a) {
        var displayName = _a.displayName;
        throw new Error("The combinator '" + displayName + "' expected one of its arguments to change the parser state.");
    }
    Issues.guardAgainstInfiniteLoop = guardAgainstInfiniteLoop;
    function quietParserNotPermitted(_a) {
        var displayName = _a.displayName;
        throw new Error("The combinator " + displayName + " expected a loud parser.");
    }
    Issues.quietParserNotPermitted = quietParserNotPermitted;
    function expectedFailureKind(_a) {
        var displayName = _a.displayName;
        throw new Error("The combinator " + displayName + " expected a failure kind.");
    }
    Issues.expectedFailureKind = expectedFailureKind;
    function willAlwaysFail(_a) {
        var displayName = _a.displayName;
        throw new Error("The parameters given to " + displayName + " will cause it to always fail.");
    }
    Issues.willAlwaysFail = willAlwaysFail;
})(Issues = exports.Issues || (exports.Issues = {}));
Array.prototype.maybePush = function (o) {
    o !== exports.QUIET_RESULT && this.push(o);
};
//# sourceMappingURL=common.js.map