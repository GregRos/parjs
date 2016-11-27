"use strict";
/**
 * Created by User on 21-Nov-16.
 */
exports.quietReturn = Object.create(null);
exports.failReturn = Object.create(null);
var Issues;
(function (Issues) {
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
})(Issues = exports.Issues || (exports.Issues = {}));
Array.prototype.maybePush = function (o) {
    o !== exports.quietReturn && this.push(o);
};
//# sourceMappingURL=common.js.map