/**
 * @module parjs/internal/implementation
 */ /** */
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @external
 */
var Issues;
(function (Issues) {
    function stringWrongLength(name, lengthHint) {
        throw new Error(`The parser ${name} accepts only strings of length ${lengthHint}`);
    }
    Issues.stringWrongLength = stringWrongLength;
    function mixedLoudnessNotPermitted(name) {
        throw new Error(`Parsers of mixed loudness are not permitted as arguments for the combinator '${name}'`);
    }
    Issues.mixedLoudnessNotPermitted = mixedLoudnessNotPermitted;
    function guardAgainstInfiniteLoop(name) {
        throw new Error(`The combinator '${name}' expected one of its arguments to change the parser state.`);
    }
    Issues.guardAgainstInfiniteLoop = guardAgainstInfiniteLoop;
    function quietParserNotPermitted(name) {
        throw new Error(`The combinator ${name} expected a loud parser.`);
    }
    Issues.quietParserNotPermitted = quietParserNotPermitted;
    function expectedFailureKind(name) {
        throw new Error(`The combinator ${name} expected a failure kind.`);
    }
    Issues.expectedFailureKind = expectedFailureKind;
    function willAlwaysFail(name) {
        throw new Error(`The parameters given to ${name} will cause it to always fail.`);
    }
    Issues.willAlwaysFail = willAlwaysFail;
})(Issues = exports.Issues || (exports.Issues = {}));
//# sourceMappingURL=issues.js.map