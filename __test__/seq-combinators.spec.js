"use strict";
/**
 * Created by lifeg on 10/12/2016.
 */
/**
 * Created by lifeg on 10/12/2016.
 */
var custom_matchers_1 = require('./custom-matchers');
var parsers_1 = require("../src/bindings/parsers");
var result_1 = require("../src/abstract/basics/result");
var _ = require('lodash');
var goodInput = "abcd";
var softBadInput = "a";
var hardBadInput = "ab";
var excessInput = "abcde";
var uState = {};
var fstLoud = parsers_1.Parjs.string("ab");
var sndLoud = parsers_1.Parjs.string("cd");
function forParser(parser, f) {
    describe("Parjs." + parser.displayName, function () {
        f(parser);
    });
}
describe("sequential combinators", function () {
    describe("then combinators", function () {
        describe("loud then loud", function () {
            var parser = fstLoud.then(sndLoud);
            it("succeeds", function () {
                custom_matchers_1.verifySuccess(parser.parse(goodInput), ["ab", "cd"]);
            });
            it("fails softly on first fail", function () {
                custom_matchers_1.verifyFailure(parser.parse(softBadInput), result_1.ResultKind.SoftFail);
            });
            it("fails hard on 2nd fail", function () {
                custom_matchers_1.verifyFailure(parser.parse(hardBadInput), result_1.ResultKind.HardFail);
            });
            it("fails on excess input", function () {
                custom_matchers_1.verifyFailure(parser.parse(excessInput), result_1.ResultKind.SoftFail);
            });
        });
        describe("loud then quiet", function () {
            var parser = fstLoud.then(sndLoud.quiet);
            it("succeeds", function () {
                custom_matchers_1.verifySuccess(parser.parse(goodInput), "ab");
            });
        });
        describe("quiet then loud", function () {
            var parser = fstLoud.quiet.then(sndLoud);
            it("succeeds", function () {
                custom_matchers_1.verifySuccess(parser.parse(goodInput), "cd");
            });
        });
        describe("quiet then quiet", function () {
            var parser = fstLoud.quiet.then(sndLoud.quiet);
            it("succeeds", function () {
                custom_matchers_1.verifySuccess(parser.parse(goodInput), undefined);
            });
        });
        describe("loud then loud then zero-consuming quiet", function () {
            var parser = fstLoud.then(sndLoud).then(parsers_1.Parjs.eof);
            it("succeeds", function () {
                custom_matchers_1.verifySuccess(parser.parse(goodInput), ["ab", "cd"]);
            });
            it("fails hard when 3rd fails", function () {
                custom_matchers_1.verifyFailure(parser.parse(excessInput), result_1.ResultKind.HardFail);
            });
        });
        describe("1 quiet using seq combinator", function () {
            var parser = parsers_1.Parjs.seq(fstLoud.quiet);
            it("succeeds with empty array value", function () {
                custom_matchers_1.verifySuccess(parser.parse("ab"), []);
            });
        });
        describe("empty seq combinator same as no match, return []", function () {
            var parser = parsers_1.Parjs.seq();
            it("succeeds on empty input", function () {
                custom_matchers_1.verifySuccess(parser.parse(""), []);
            });
            it("fails on excess input", function () {
                custom_matchers_1.verifyFailure(parser.parse("a"), result_1.ResultKind.SoftFail);
            });
        });
    });
    describe("many combinators", function () {
        describe("regular many", function () {
            var parser = fstLoud.many();
            it("success on empty input", function () {
                custom_matchers_1.verifySuccess(parser.parse(""), []);
            });
            it("failure on non-empty input without any matches", function () {
                custom_matchers_1.verifyFailure(parser.parse("12"), result_1.ResultKind.SoftFail);
            });
            it("success on single match", function () {
                custom_matchers_1.verifySuccess(parser.parse("ab"), ["ab"]);
            });
            it("success on N matches", function () {
                custom_matchers_1.verifySuccess(parser.parse("ababab"), ["ab", "ab", "ab"]);
            });
            it("chains to EOF correctly", function () {
                var endEof = parser.then(parsers_1.Parjs.eof);
                custom_matchers_1.verifySuccess(endEof.parse("abab"), ["ab", "ab"]);
            });
        });
        describe("many with zero-length match", function () {
            var parser = parsers_1.Parjs.result(0).many();
            it("guards against zero match in inner parser", function () {
                expect(function () { return parser.parse("abab"); }).toThrow();
            });
            it("ignores guard when given max iterations", function () {
                var parser = parsers_1.Parjs.result(0).many(undefined, 10);
                custom_matchers_1.verifySuccess(parser.parse(""), _.range(0, 10).map(function (x) { return 0; }));
            });
        });
        describe("many with min successes", function () {
            var parser = fstLoud.many(2);
            it("succeeds when number of successes >= minimum", function () {
                custom_matchers_1.verifySuccess(parser.parse("abab"), ["ab", "ab"]);
            });
            it("fails when number of successses < minimum", function () {
                custom_matchers_1.verifyFailure(parser.parse("ab"), result_1.ResultKind.HardFail);
            });
        });
        describe("many with bounded iterations, min successes", function () {
            it("guards against impossible requirements", function () {
                expect(function () { return fstLoud.many(2, 1); }).toThrow();
            });
            var parser = fstLoud.many(1, 2);
            it("succeeds when appropriate", function () {
                custom_matchers_1.verifySuccess(parser.parse("abab"), ["ab", "ab"]);
            });
            it("fails when there is excess input", function () {
                custom_matchers_1.verifyFailure(parser.parse("ababab"), result_1.ResultKind.SoftFail);
            });
        });
        describe("many on quiet parser", function () {
            var parser = fstLoud.quiet.many();
            it("succeeds without a value", function () {
                custom_matchers_1.verifySuccess(parser.parse("abab"), undefined);
            });
        });
    });
    describe("exactly combinator", function () {
        var parser = fstLoud.exactly(2);
        it("succeeds with exact matches", function () {
            custom_matchers_1.verifySuccess(parser.parse("abab"), ["ab", "ab"]);
        });
        it("quiet exactly succeeds without value", function () {
            var parser = fstLoud.quiet.exactly(2);
            custom_matchers_1.verifySuccess(parser.parse("abab"), undefined);
        });
        it("hard fails with 0 < matches <= N", function () {
            custom_matchers_1.verifyFailure(parser.parse("ab"), result_1.ResultKind.HardFail);
        });
        it("soft fails with matches == 0", function () {
            custom_matchers_1.verifyFailure(parser.parse("a"), result_1.ResultKind.SoftFail);
        });
    });
    describe("manySepBy combinator", function () {
        var parser = fstLoud.manySepBy(parsers_1.Parjs.string(", "));
        it("succeeds with empty input", function () {
            custom_matchers_1.verifySuccess(parser.parse(""), []);
        });
        it("succeeds with non-empty input", function () {
            custom_matchers_1.verifySuccess(parser.parse("ab, ab"), ["ab", "ab"]);
        });
        it("chains into terminating separator", function () {
            var parser2 = parser.then(parsers_1.Parjs.string(", ").quiet);
            custom_matchers_1.verifySuccess(parser2.parse("ab, ab, "), ["ab", "ab"]);
        });
        it("fails soft if first many fails", function () {
            custom_matchers_1.verifyFailure(parser.parse("xa"), result_1.ResultKind.SoftFail);
        });
    });
    describe("manyTill combinator", function () {
        var parser = fstLoud.manyTill(sndLoud);
        it("succeeds matching 1 then till", function () {
            custom_matchers_1.verifySuccess(parser.parse("abcd"), ["ab"]);
        });
        it("succeeds matching 1 then till, chains", function () {
            var parser2 = parser.then(fstLoud.quiet);
            custom_matchers_1.verifySuccess(parser2.parse("abcdab"), ["ab"]);
        });
        it("fails soft when many fails 1st time without till", function () {
            custom_matchers_1.verifyFailure(parser.parse("1"), result_1.ResultKind.SoftFail);
        });
        it("fails hard when many fails 2nd time without till", function () {
            custom_matchers_1.verifyFailure(parser.parse("ab1"), result_1.ResultKind.HardFail);
        });
    });
});
//# sourceMappingURL=seq-combinators.spec.js.map